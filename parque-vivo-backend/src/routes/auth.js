
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();

// CADASTRO
router.post('/cadastro', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                erro: 'Preencha todos os campos.'
            });
        }

        if (nome.trim().split(/\s+/).length < 2) {
            return res.status(400).json({
                erro: 'Informe seu nome completo.'
            });
        }

        if (!/^[^\s@]+@gmail\.com$/i.test(email.trim())) {
            return res.status(400).json({
                erro: 'Utilize um endereço Gmail válido.'
            });
        }

        if (senha.length < 6 || senha.length > 20) {
            return res.status(400).json({
                erro: 'A senha deve ter entre 6 e 20 caracteres.'
            });
        }

        const [existente] = await pool.execute(
            'SELECT id FROM usuarios WHERE email = ?',
            [email.trim().toLowerCase()]
        );

        if (existente.length > 0) {
            return res.status(409).json({
                erro: 'Este e-mail já está cadastrado.'
            });
        }

        const senhaHash = await bcrypt.hash(senha, 12);

        const [resultado] = await pool.execute(
            'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
            [
                nome.trim(),
                email.trim().toLowerCase(),
                senhaHash
            ]
        );

        return res.status(201).json({
            mensagem: 'Cadastro realizado com sucesso!',
            usuario: {
                id: resultado.insertId,
                nome: nome.trim(),
                email: email.trim().toLowerCase()
            }
        });

    } catch (erro) {
        console.error('Erro no cadastro:', erro);

        return res.status(500).json({
            erro: 'Erro interno ao realizar cadastro.'
        });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                erro: 'Informe e-mail e senha.'
            });
        }

        if (!/^[^\s@]+@gmail\.com$/i.test(email.trim())) {
            return res.status(400).json({
                erro: 'Utilize um endereço Gmail válido.'
            });
        }

        const [usuarios] = await pool.execute(
            'SELECT id, nome, email, senha FROM usuarios WHERE email = ?',
            [email.trim().toLowerCase()]
        );

        if (usuarios.length === 0) {
            return res.status(401).json({
                erro: 'E-mail ou senha incorretos.'
            });
        }

        const usuario = usuarios[0];

        const senhaCorreta = await bcrypt.compare(
            senha,
            usuario.senha
        );

        if (!senhaCorreta) {
            return res.status(401).json({
                erro: 'E-mail ou senha incorretos.'
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '2h'
            }
        );

        return res.status(200).json({
            mensagem: 'Login realizado com sucesso!',
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            }
        });

    } catch (erro) {
        console.error('Erro no login:', erro);

        return res.status(500).json({
            erro: 'Erro interno ao realizar login.'
        });
    }
});

module.exports = router;
