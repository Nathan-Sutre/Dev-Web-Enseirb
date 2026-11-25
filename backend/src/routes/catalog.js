import express from 'express';
import { getMovies, getSeries } from './tmdb.js';

const router = express.Router();

router.get('/films', async (req, res) => {
    try {
        const films = await getMovies("movie");
        res.status(200).json(films);
    } catch (error) {
        console.error(error.message);
        res.status(502).json({ message: 'Impossible de charger les films TMDB.' });
    }
});

router.get('/series', async (req, res) => {
    try {
        const series = await getSeries("tv");
        res.status(200).json(series);
    } catch (error) {
        console.error(error.message);
        res.status(502).json({ message: 'Impossible de charger les séries TMDB.' });
    }
});

router.get('/catalog', async (req, res) => {
    try {
        const [movies, series] = await Promise.all([
            getMovies('movie'),
            getSeries('tv'),
        ]);

        res.json({ movies, series });
    } catch (error) {
        console.error(error.message);
        res.status(502).json({ message: 'Impossible de charger le catalogue TMDB.' });
    }
});

router.get('/series/random/10', async (req, res) => {
    try {
        const series = await getSeries("tv");
        const shuffledSeries = [...series];

        for (let index = shuffledSeries.length - 1; index > 0; index -= 1) {
            const randomIndex = Math.floor(Math.random() * (index + 1));
            [shuffledSeries[index], shuffledSeries[randomIndex]] =
                [shuffledSeries[randomIndex], shuffledSeries[index]];
        }

        res.status(200).json(shuffledSeries.slice(0, 10));
    } catch (error) {
        console.error(error.message);
        res.status(502).json({ message: 'Impossible de charger les séries TMDB.' });
    }
});

router.get('/films/random/10', async (req, res) => {
    try {
        const films = await getMovies("movie");
        const shuffledFilms = [...films];

    for (let index = shuffledFilms.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [shuffledFilms[index], shuffledFilms[randomIndex]] =
            [shuffledFilms[randomIndex], shuffledFilms[index]];
    }

        res.status(200).json(shuffledFilms.slice(0, 10));
    } catch (error) {
        console.error(error.message);
        res.status(502).json({ message: 'Impossible de charger les films TMDB.' });
    }
});

router.get('/catalog/random', async (req, res) => {
    try {
        const [movies, series] = await Promise.all([
            getMovies('movie'),
            getSeries('tv'),
        ]);
        const catalog = [...movies, ...series];
        const randomIndex = Math.floor(Math.random() * catalog.length);
        res.status(200).json(catalog[randomIndex]);
    } catch (error) {
        console.error(error.message);
        res.status(502).json({ message: 'Impossible de charger le catalogue TMDB.' });
    }
});

router.get('/films/:id', async (req, res) => {
    try {
        const films = await getMovies("movie");
        const film = films.find((item) => item.id === Number(req.params.id));

    if (!film) {
        return res.status(404).json({ message: 'Film introuvable' });
    }

        res.status(200).json(film);
    } catch (error) {
        console.error(error.message);
        res.status(502).json({ message: 'Impossible de charger les films TMDB.' });
    }
});

router.get('/series/:id', async (req, res) => {
    try {
        const series = await getSeries("tv");
        const serie = series.find((item) => item.id === Number(req.params.id));

    if (!serie) {
        return res.status(404).json({ message: 'Série introuvable' });
    }

        res.status(200).json(serie);
    } catch (error) {
        console.error(error.message);
        res.status(502).json({ message: 'Impossible de charger les séries TMDB.' });
    }
});

export default router;
