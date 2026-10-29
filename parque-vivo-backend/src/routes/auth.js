const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { autenticar } = require('../middleware/auth');

const router = express.Router();

router.post('/cadastro', async (req, res, next) => {
  try {
    const nome = typeof req.body.nome === 'string' ? req.body.nome.trim() : '';
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const senha = typeof req.body.senha === 'string' ? req.body.senha : '';
    if (nome.length < 2 || nome.length > 120) return res.status(400).json({ erro: 'Informe um nome entre 2 e 120 caracteres.' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 190) return res.status(400).json({ erro: 'Informe um e-mail válido.' });
    if (senha.length < 8 || senha.length > 72) return res.status(400).json({ erro: 'A senha deve ter entre 8 e 72 caracteres.' });

    const [existente] = await pool.execute('SELECT id_usuario FROM usuarios WHERE email = ?', [email]);
    if (existente.length) return res.status(409).json({ erro: 'Já existe uma conta com esse e-mail.' });
    const senhaHash = await bcrypt.hash(senha, 12);
    const [resultado] = await pool.execute(
      'INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)', [nome, email, senhaHash]
    );
    return res.status(201).json({ mensagem: 'Cadastro realizado com sucesso.', usuario: { id_usuario: resultado.insertId, nome, email } });
  } catch (erro) {
    if (erro.code === 'ER_DUP_ENTRY') return res.status(409).json({ erro: 'Já existe uma conta com esse e-mail.' });
    next(erro);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const senha = typeof req.body.senha === 'string' ? req.body.senha : '';
    const [rows] = await pool.execute(
      'SELECT id_usuario, nome, email, senha_hash FROM usuarios WHERE email = ?', [email]
    );
    if (!rows.length || !(await bcrypt.compare(senha, rows[0].senha_hash))) {
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
    }
    const usuario = rows[0];
    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
    );
    return res.json({ token, tipo: 'Bearer', expira_em: process.env.JWT_EXPIRES_IN || '2h', usuario: { id_usuario: usuario.id_usuario, nome: usuario.nome, email: usuario.email } });
  } catch (erro) { next(erro); }
});

router.get('/me', autenticar, async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id_usuario, nome, email, criado_em FROM usuarios WHERE id_usuario = ?', [req.usuario.id_usuario]
    );
    if (!rows.length) return res.status(404).json({ erro: 'Usuário não encontrado.' });
    return res.json({ usuario: rows[0] });
  } catch (erro) { next(erro); }
});

module.exports = router;
