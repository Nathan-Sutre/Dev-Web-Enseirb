import express from 'express';

const router = express.Router();

const films = [
    {
        id: 1,
        type: 'film',
        title: 'Le Dernier Rivage',
        releaseYear: 2024,
        overview: 'Une expédition découvre une ville oubliée au bord de l’océan.'
    },
    {
        id: 2,
        type: 'film',
        title: 'Les Jours de verre',
        releaseYear: 2022,
        overview: 'Deux amis tentent de préserver le cinéma de leur quartier.'
    },
    {
        id: 3,
        type: 'film',
        title: 'Orbite',
        releaseYear: 2023,
        overview: 'Une équipe doit réparer sa station avant de perdre le contact avec la Terre.'
    },
    {
        id: 4,
        type: 'film',
        title: 'La Maison des brumes',
        releaseYear: 2021,
        overview: 'Un héritage inattendu mène une famille dans un village isolé.'
    },
    {
        id: 5,
        type: 'film',
        title: 'À contre-courant',
        releaseYear: 2025,
        overview: 'Une jeune navigatrice se prépare à traverser l’Atlantique en solitaire.'
    }
];

const series = [
    {
        id: 6,
        type: 'serie',
        title: 'Quartier libre',
        releaseYear: 2023,
        overview: 'Les habitants d’un immeuble s’organisent pour sauver leur jardin partagé.'
    },
    {
        id: 7,
        type: 'serie',
        title: 'Les Cartographes',
        releaseYear: 2024,
        overview: 'Une équipe explore des régions qui n’apparaissent sur aucune carte.'
    },
    {
        id: 8,
        type: 'serie',
        title: 'La Relève',
        releaseYear: 2022,
        overview: 'Un club sportif forme une nouvelle génération de joueuses.'
    },
    {
        id: 9,
        type: 'serie',
        title: 'Après minuit',
        releaseYear: 2021,
        overview: 'Chaque nuit, une journaliste reçoit un message lié à une affaire ancienne.'
    },
    {
        id: 10,
        type: 'serie',
        title: 'Les Passerelles',
        releaseYear: 2025,
        overview: 'Des inconnus découvrent que leurs vies sont liées par un même lieu.'
    }
];

const catalog = [...films, ...series];

router.get('/films', (req, res) => {
    res.status(200).json(films);
});

router.get('/series', (req, res) => {
    res.status(200).json(series);
});

router.get('/catalog', (req, res) => {
    res.status(200).json(catalog);
});

router.get('/series/random/10', (req, res) => {
    const shuffledSeries = [...series];

    for (let index = shuffledSeries.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [shuffledSeries[index], shuffledSeries[randomIndex]] =
            [shuffledSeries[randomIndex], shuffledSeries[index]];
    }

    res.status(200).json(shuffledSeries.slice(0, 10));
});

router.get('/films/random/10', (req, res) => {
    const shuffledFilms = [...films];

    for (let index = shuffledFilms.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [shuffledFilms[index], shuffledFilms[randomIndex]] =
            [shuffledFilms[randomIndex], shuffledFilms[index]];
    }

    res.status(200).json(shuffledFilms.slice(0, 10));
});

router.get('/catalog/random', (req, res) => {
    const randomIndex = Math.floor(Math.random() * catalog.length);
    res.status(200).json(catalog[randomIndex]);
});

router.get('/films/:id', (req, res) => {
    const film = films.find((item) => item.id === Number(req.params.id));

    if (!film) {
        return res.status(404).json({ message: 'Film introuvable' });
    }

    res.status(200).json(film);
});

router.get('/series/:id', (req, res) => {
    const serie = series.find((item) => item.id === Number(req.params.id));

    if (!serie) {
        return res.status(404).json({ message: 'Série introuvable' });
    }

    res.status(200).json(serie);
});

export default router;
