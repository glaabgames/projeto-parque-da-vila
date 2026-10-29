const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id_quadra, nome, esporte, descricao FROM quadras WHERE ativa = TRUE ORDER BY nome'
    );
    res.json({ quadras: rows });
  } catch (erro) { next(erro); }
});

module.exports = router;
