const express = require('express');
const pool = require('../db');
const { autenticar } = require('../middleware/auth');

const router = express.Router();

// Converte uma data local para o formato aceito pelo MySQL DATETIME.
// Não utiliza Date.toISOString(), pois isso converteria o horário para UTC.
function formatarDataMySQL(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    const hora = String(data.getHours()).padStart(2, '0');
    const minuto = String(data.getMinutes()).padStart(2, '0');
    const segundo = String(data.getSeconds()).padStart(2, '0');

    return `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;
}

// LISTAR AGENDAMENTOS DO USUÁRIO
router.get('/', autenticar, async (req, res) => {
    try {
        const [agendamentos] = await pool.execute(
            `SELECT
                a.id,
                a.usuario_id,
                a.espaco_id,
                DATE_FORMAT(a.inicio, '%Y-%m-%d %H:%i:%s') AS inicio,
                DATE_FORMAT(a.fim, '%Y-%m-%d %H:%i:%s') AS fim,
                a.status,
                e.nome AS espaco
             FROM agendamentos a
             INNER JOIN espacos e ON e.id = a.espaco_id
             WHERE a.usuario_id = ?
             ORDER BY a.criado_em DESC, a.id DESC`,
            [req.usuario.id]
        );

        return res.status(200).json(agendamentos);

    } catch (erro) {
        console.error('Erro ao buscar agendamentos:', erro);

        return res.status(500).json({
            erro: 'Erro ao consultar agendamentos.'
        });
    }
});

// CONSULTAR HORÁRIOS JÁ RESERVADOS POR QUALQUER USUÁRIO
router.get('/disponibilidade/:espacoId', autenticar, async (req, res) => {
    try {
        const { espacoId } = req.params;
        const { data } = req.query;

        if (!Number.isInteger(Number(espacoId)) || Number(espacoId) <= 0) {
            return res.status(400).json({
                erro: 'Espaço inválido.'
            });
        }

        if (!data || !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
            return res.status(400).json({
                erro: 'Informe uma data válida (AAAA-MM-DD).'
            });
        }

        const [horarios] = await pool.execute(
            `SELECT
                DATE_FORMAT(inicio, '%H:%i') AS horario
             FROM agendamentos
             WHERE espaco_id = ?
             AND status = 'confirmado'
             AND inicio >= ?
             AND inicio < DATE_ADD(?, INTERVAL 1 DAY)
             ORDER BY inicio`,
            [
                Number(espacoId),
                `${data} 00:00:00`,
                `${data} 00:00:00`
            ]
        );

        return res.status(200).json(horarios);

    } catch (erro) {
        console.error('Erro ao consultar disponibilidade:', erro);

        return res.status(500).json({
            erro: 'Erro ao consultar horários disponíveis.'
        });
    }
});

// CRIAR AGENDAMENTO
router.post('/', autenticar, async (req, res) => {
    const { espaco_id, inicio } = req.body;
    console.log('HORÁRIO RECEBIDO DO APP:', inicio);

    if (!espaco_id || !inicio) {
        return res.status(400).json({
            erro: 'Informe o espaço e o horário.'
        });
    }

    if (!Number.isInteger(Number(espaco_id)) || Number(espaco_id) <= 0) {
        return res.status(400).json({
            erro: 'Espaço inválido.'
        });
    }

    // Aceita somente data e hora local, sem indicação de fuso horário.
    const correspondencia = String(inicio).match(
        /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/
    );

    if (!correspondencia) {
        return res.status(400).json({
            erro: 'Informe a data e o horário no formato correto.'
        });
    }

    const ano = Number(correspondencia[1]);
    const mes = Number(correspondencia[2]);
    const dia = Number(correspondencia[3]);
    const hora = Number(correspondencia[4]);
    const minuto = Number(correspondencia[5]);
    const segundo = Number(correspondencia[6]);

    const dataInicio = new Date(
        ano,
        mes - 1,
        dia,
        hora,
        minuto,
        segundo
    );

    // Impede datas inexistentes, como 31/02, e horários inválidos.
    if (
        dataInicio.getFullYear() !== ano ||
        dataInicio.getMonth() !== mes - 1 ||
        dataInicio.getDate() !== dia ||
        dataInicio.getHours() !== hora ||
        dataInicio.getMinutes() !== minuto ||
        dataInicio.getSeconds() !== segundo
    ) {
        return res.status(400).json({
            erro: 'Data e horário inválidos.'
        });
    }

    if (dataInicio <= new Date()) {
        return res.status(400).json({
            erro: 'Escolha um horário futuro.'
        });
    }

    // O MySQL recebe strings locais, sem conversão automática de fuso.
    const inicioMySQL = formatarDataMySQL(dataInicio);

    const dataFim = new Date(
        dataInicio.getTime() + 60 * 60 * 1000
    );

    const fimMySQL = formatarDataMySQL(dataFim);

    let conexao;

    try {
        conexao = await pool.getConnection();

        await conexao.beginTransaction();

        // O bloqueio da linha do espaço evita duas reservas simultâneas
        // para o mesmo espaço durante a verificação de disponibilidade.
        const [espacos] = await conexao.execute(
            `SELECT id, duracao_reserva_minutos
             FROM espacos
             WHERE id = ? AND ativo = 1
             FOR UPDATE`,
            [Number(espaco_id)]
        );

        if (espacos.length === 0) {
            await conexao.rollback();

            return res.status(404).json({
                erro: 'Espaço não encontrado ou indisponível.'
            });
        }

        const duracao = Number(espacos[0].duracao_reserva_minutos);

        if (duracao !== 60) {
            await conexao.rollback();

            return res.status(400).json({
                erro: 'Este espaço não possui reserva de uma hora configurada.'
            });
        }

        // Verifica sobreposição de intervalos, não apenas horários iguais.
        const [conflitos] = await conexao.execute(
            `SELECT id
             FROM agendamentos
             WHERE espaco_id = ?
             AND status = 'confirmado'
             AND inicio < ?
             AND fim > ?
             LIMIT 1`,
            [
                Number(espaco_id),
                fimMySQL,
                inicioMySQL
            ]
        );

        if (conflitos.length > 0) {
            await conexao.rollback();

            return res.status(409).json({
                erro: 'Horário já reservado.'
            });
        }

        const [resultado] = await conexao.execute(
            `INSERT INTO agendamentos
                (usuario_id, espaco_id, inicio, fim, status)
             VALUES (?, ?, ?, ?, 'confirmado')`,
            [
                req.usuario.id,
                Number(espaco_id),
                inicioMySQL,
                fimMySQL
            ]
        );

        await conexao.commit();

        return res.status(201).json({
            mensagem: 'Agendamento confirmado!',
            agendamento: {
                id: resultado.insertId,
                espaco_id: Number(espaco_id),
                inicio: inicioMySQL,
                fim: fimMySQL,
                status: 'confirmado'
            }
        });

    } catch (erro) {
        if (conexao) {
            await conexao.rollback();
        }

        console.error('Erro ao criar agendamento:', erro);

        return res.status(500).json({
            erro: 'Erro ao realizar agendamento.'
        });

    } finally {
        if (conexao) {
            conexao.release();
        }
    }
});

// CANCELAR AGENDAMENTO
router.patch('/:id/cancelar', autenticar, async (req, res) => {
    try {
        const [resultado] = await pool.execute(
            `UPDATE agendamentos
             SET status = 'cancelado'
             WHERE id = ?
             AND usuario_id = ?
             AND status = 'confirmado'`,
            [
                req.params.id,
                req.usuario.id
            ]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                erro: 'Agendamento não encontrado ou já cancelado.'
            });
        }

        return res.status(200).json({
            mensagem: 'Agendamento cancelado com sucesso.'
        });

    } catch (erro) {
        console.error('Erro ao cancelar agendamento:', erro);

        return res.status(500).json({
            erro: 'Erro ao cancelar agendamento.'
        });
    }
});

module.exports = router;