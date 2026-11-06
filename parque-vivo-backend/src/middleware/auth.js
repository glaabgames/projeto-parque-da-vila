
const jwt = require('jsonwebtoken');

function autenticar(req, res, next) {
    const cabecalho = req.headers.authorization;

    if (!cabecalho || !cabecalho.startsWith('Bearer ')) {
        return res.status(401).json({
            erro: 'Token de autenticação não informado.'
        });
    }

    const token = cabecalho.split(' ')[1];

    try {
        const decodificado = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.usuario = {
            id: decodificado.id,
            email: decodificado.email
        };

        next();

    } catch (erro) {
        return res.status(401).json({
            erro: 'Token inválido ou expirado.'
        });
    }
}

module.exports = { autenticar };
