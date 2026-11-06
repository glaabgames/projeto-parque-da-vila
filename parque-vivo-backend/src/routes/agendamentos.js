
const express = require('express');
const pool = require('../db');
const { autenticar } = require('../middleware/auth');

const router = express.Router();

// LISTAR AGENDAMENTOS DO USUÁRIO
router.get('/', autenticar, async (req, res) => {
    try {
        const [agendamentos] = await pool.execute(
            `SELECT
                a.id,
                a.usuario_id,
                a.espaco_id,
                a.inicio,
                a.fim,
                a.status,
                e.nome AS espaco
             FROM agendamentos a
             INNER JOIN espacos e ON e.id = a.espaco_id
             WHERE a.usuario_id = ?
             ORDER BY a.inicio DESC`,
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
// Consultar horários já reservados por qualquer usuário
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

        const [horarios] = await pool.query(
            `SELECT DATE_FORMAT(inicio, '%H:%i') AS horario
             FROM agendamentos
             WHERE espaco_id = ?
             AND status = 'confirmado'
             AND DATE(inicio) = ?
             ORDER BY inicio`,
            [Number(espacoId), data]
        );

        return res.json(horarios);

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

    if (!espaco_id || !inicio) {
        return res.status(400).json({
            erro: 'Informe o espaço e o horário.'
        });
    }

    const dataInicio = new Date(inicio);

    if (Number.isNaN(dataInicio.getTime())) {
        return res.status(400).json({
            erro: 'Data e horário inválidos.'
        });
    }

    if (dataInicio <= new Date()) {
        return res.status(400).json({
            erro: 'Escolha um horário futuro.'
        });
    }

    let conexao;

    try {
        conexao = await pool.getConnection();
        await conexao.beginTransaction();

        const [espacos] = await conexao.execute(
            `SELECT id, duracao_reserva_minutos
             FROM espacos
             WHERE id = ? AND ativo = 1
             FOR UPDATE`,
            [espaco_id]
        );

        if (espacos.length === 0) {
            await conexao.rollback();
            return res.status(404).json({
                erro: 'Espaço não encontrado ou indisponível.'
            });
        }

        const duracao = espacos[0].duracao_reserva_minutos;

        if (!duracao || duracao !== 60) {
            await conexao.rollback();
            return res.status(400).json({
                erro: 'Este espaço não possui reserva de uma hora configurada.'
            });
        }

        const dataFim = new Date(
            dataInicio.getTime() + duracao * 60 * 1000
        );

        const [conflitos] = await conexao.execute(
            `SELECT id
             FROM agendamentos
             WHERE espaco_id = ?
             AND status = 'confirmado'
             AND inicio < ?
             AND fim > ?
             LIMIT 1`,
            [espaco_id, dataFim, dataInicio]
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
            [req.usuario.id, espaco_id, dataInicio, dataFim]
        );

        await conexao.commit();

        return res.status(201).json({
            mensagem: 'Agendamento confirmado!',
            agendamento: {
                id: resultado.insertId,
                espaco_id,
                inicio: dataInicio,
                fim: dataFim,
                status: 'confirmado'
            }
        });

    } catch (erro) {
        if (conexao) await conexao.rollback();

        console.error('Erro ao criar agendamento:', erro);

        return res.status(500).json({
            erro: 'Erro ao realizar agendamento.'
        });

    } finally {
        if (conexao) conexao.release();
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
            [req.params.id, req.usuario.id]
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
