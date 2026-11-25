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

/* Démarrage BDD et serveur */
app.listen(PORT, () =>
    console.log(`SeenFlix a démarré sur http://localhost:${PORT}`)
);