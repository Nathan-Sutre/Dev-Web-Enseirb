'use strict;';

import authRoutes from './src/routes/auth.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';

// Initialisation serveur
const app = express();
const PORT = 3000;
// Sécurité
app.use(cors());
// Configuration parser body
app.use(bodyParser.json());

/* Routes Express */

// Route /
app.get("/", (req, res) => {
    res.status(200).json({
        message: 'Serveur OK'
    });
});

// Routes Auth
app.use('/auth', authRoutes);

// Routes API TMDB
async function getPopular(type) {
    const response = await fetch(
        `https://api.themoviedb.org/3/${type}/popular?language=fr-FR`,
        {
            headers: {
                Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
                Accept: 'application/json',
            },
        },
    );

    if (!response.ok) {
        throw new Error(`TMDB a répondu avec le statut ${response.status}`);
    }

    const data = await response.json();
    return data.results;
}

app.get('/catalog', async (req, res) => {
    try {
        const [movies, series] = await Promise.all([
            getPopular('movie'),
            getPopular('tv'),
        ]);

        res.json({ movies, series });
    } catch (error) {
        console.error(error.message);
        res.status(502).json({ message: 'Impossible de charger le catalogue TMDB.' });
    }
});

/* Démarrage BDD et serveur */
app.listen(PORT, () =>
    console.log(`SeenFlix a démarré sur http://localhost:${PORT}`)
);