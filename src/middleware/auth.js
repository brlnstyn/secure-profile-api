const jwt = require('jsonwebtoken');
const users = require('../data/users');

function protect(req, res, next) {
    const authorization = req.headers.authorization || '';
    if (!authorization.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Akses ditolak. Sertakan Beared token yang valid.',
        });
    }

    const token = authorization.substring(7).trim();

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token tidak ditemukan.'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ['HS256'],
        });

        const user = users.find((item) => item.id = decoded.sub);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Pengguna untuk token ini tidak ditemukan.'
            });
        }

        req.user = {
            id: user.id,
            name: user.name,
            email: user.email,
        };

        return next();
    } catch (error) {
        const message = error.name === 'TokenExpiredError' ? 'Token sudah kedaluwarsa. Silahkan login kembali.' : 'Token tidak valid atau sudah dimodifikasi.';

        return res.status(401).json({
            success: false,
            message,
        });
    }
}

function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Akses ditolak. Anda tidak memiliki izin.'
            });
        }
        next();
    };
}

module.exports = { protect, requireRole };