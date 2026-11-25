import express from 'express';

const router = express.Router();

// POST /auth/register
router.post('/register', (req, res) => {
    res.status(201).json({
        message: "Inscription réussie"
    });
});

// POST /auth/login
router.post('/login', (req, res) => {
    res.status(200).json({
        accessToken: "test_access_token",
        refreshToken: "test_refresh_token"
    });
});

// POST /auth/refresh
router.post('/refresh', (req, res) => {
    const refreshToken = req.headers['x-refresh-token'];

    if (!refreshToken) {
        return res.status(401).json({
            message: "Refresh token manquant"
        });
    }

    res.status(200).json({
        accessToken: "new_test_access_token",
        refreshToken: "new_test_refresh_token"
    });
});

export default router;