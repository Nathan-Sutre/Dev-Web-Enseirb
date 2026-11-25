
import 'dotenv/config';

async function getMovies(type) {
    const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?language=fr-FR`,
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
    return data;
}

async function getSeries(type) {
    const response = await fetch(
        `https://api.themoviedb.org/3/discover/tv?language=fr-FR`,
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
    return data;
}

export { getMovies, getSeries };