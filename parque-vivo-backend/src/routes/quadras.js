
const express = require('express');
const pool = require('../db');

const router = express.Router();

// LISTAR ESPAÇOS ESPORTIVOS DISPONÍVEIS
router.get('/', async (req, res) => {
    try {
        const [quadras] = await pool.execute(
            `SELECT
                id,
                nome,
                tipo AS esporte,
                descricao,
                duracao_reserva_minutos
             FROM espacos
             WHERE ativo = 1
             AND duracao_reserva_minutos IS NOT NULL
             ORDER BY id`
        );

        return res.status(200).json(quadras);

    } catch (erro) {
        console.error('Erro ao buscar espaços esportivos:', erro);

        return res.status(500).json({
            erro: 'Erro ao consultar os espaços esportivos.'
        });
    }
});

module.exports = router;