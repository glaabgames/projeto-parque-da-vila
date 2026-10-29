const express = require('express');
const pool = require('../db');
const { autenticar } = require('../middleware/auth');
const router = express.Router();

function parseInicio(valor) {
  if (typeof valor !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:00$/.test(valor)) return null;
  const data = new Date(`${valor}:00.000Z`);
  if (Number.isNaN(data.getTime()) || data.toISOString().slice(0, 16) !== valor) return null;
  return data;
}

router.use(autenticar);

// Horários sempre começam em hora cheia e duram exatamente 60 minutos.
router.post('/', async (req, res, next) => {
  let conn;
  try {
    const idQuadra = Number(req.body.id_quadra);
    const inicio = parseInicio(req.body.inicio);
    if (!Number.isSafeInteger(idQuadra) || idQuadra < 1) return res.status(400).json({ erro: 'Informe uma quadra válida.' });
    if (!inicio) return res.status(400).json({ erro: 'Informe inicio no formato YYYY-MM-DDTHH:00, por exemplo 2026-11-05T14:00.' });
    if (inicio.getTime() <= Date.now()) return res.status(400).json({ erro: 'Escolha um horário futuro.' });
    const fim = new Date(inicio.getTime() + 60 * 60 * 1000);
    const inicioSql = inicio.toISOString().slice(0, 19).replace('T', ' ');
    const fimSql = fim.toISOString().slice(0, 19).replace('T', ' ');

    conn = await pool.getConnection();
    await conn.beginTransaction();
    // Bloqueia a linha da quadra durante a checagem e inserção, evitando duas reservas simultâneas.
    const [quadras] = await conn.execute(
      'SELECT id_quadra FROM quadras WHERE id_quadra = ? AND ativa = TRUE FOR UPDATE', [idQuadra]
    );
    if (!quadras.length) {
      await conn.rollback();
      return res.status(404).json({ erro: 'Quadra não encontrada ou indisponível.' });
    }
    const [conflitos] = await conn.execute(
      `SELECT id_agendamento FROM agendamentos
       WHERE id_quadra = ? AND status = 'confirmado'
       AND inicio < ? AND fim > ? LIMIT 1`, [idQuadra, fimSql, inicioSql]
    );
    if (conflitos.length) {
      await conn.rollback();
      return res.status(409).json({ erro: 'Esse horário acabou de ser reservado. Escolha outro horário.' });
    }
    const [resultado] = await conn.execute(
      `INSERT INTO agendamentos (id_usuario, id_quadra, inicio, fim, status)
       VALUES (?, ?, ?, ?, 'confirmado')`, [req.usuario.id_usuario, idQuadra, inicioSql, fimSql]
    );
    await conn.commit();
    return res.status(201).json({
      mensagem: 'Agendamento confirmado!',
      agendamento: { id_agendamento: resultado.insertId, id_usuario: req.usuario.id_usuario, id_quadra: idQuadra, inicio: inicioSql, fim: fimSql, status: 'confirmado' }
    });
  } catch (erro) {
    if (conn) await conn.rollback();
    next(erro);
  } finally { if (conn) conn.release(); }
});

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT a.id_agendamento, a.id_quadra, q.nome AS nome_quadra, q.esporte,
              a.inicio, a.fim, a.status, a.criado_em
       FROM agendamentos a JOIN quadras q ON q.id_quadra = a.id_quadra
       WHERE a.id_usuario = ? ORDER BY a.inicio DESC`, [req.usuario.id_usuario]
    );
    res.json({ agendamentos: rows });
  } catch (erro) { next(erro); }
});

router.patch('/:id/cancelar', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id < 1) return res.status(400).json({ erro: 'Agendamento inválido.' });
    const [result] = await pool.execute(
      `UPDATE agendamentos SET status = 'cancelado', cancelado_em = NOW()
       WHERE id_agendamento = ? AND id_usuario = ? AND status = 'confirmado' AND inicio > NOW()`,
      [id, req.usuario.id_usuario]
    );
    if (!result.affectedRows) return res.status(404).json({ erro: 'Agendamento não encontrado, já cancelado ou já iniciado.' });
    res.json({ mensagem: 'Agendamento cancelado.' });
  } catch (erro) { next(erro); }
});

module.exports = router;
