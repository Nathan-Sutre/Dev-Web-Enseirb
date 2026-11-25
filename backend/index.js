'use strict;';

import authRoutes from './src/routes/auth.js';
import catalogRoutes from './src/routes/catalog.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';
import 'dotenv/config';

// Initialisation serveur
const app = express();
const port = process.env.PORT || 3000;

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
app.use('/', catalogRoutes);

/* Démarrage BDD et serveur */
app.listen(port, () =>
    console.log(`SeenFlix a démarré sur http://localhost:${port}`)
);