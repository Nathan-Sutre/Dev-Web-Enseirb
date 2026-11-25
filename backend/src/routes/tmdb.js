
import 'dotenv/config';

async function getMovies(type, page = 1, query = '') {
    const params = new URLSearchParams({ language: 'fr-FR', page: String(page) });
    const endpoint = query ? 'search/movie' : 'discover/movie';

    if (query) {
        params.set('query', query);
    }

    const response = await fetch(
        `https://api.themoviedb.org/3/${endpoint}?${params}`,
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

async function getSeries(type, page = 1, query = '') {
    const params = new URLSearchParams({ language: 'fr-FR', page: String(page) });
    const endpoint = query ? 'search/tv' : 'discover/tv';

    if (query) {
        params.set('query', query);
    }

    const response = await fetch(
        `https://api.themoviedb.org/3/${endpoint}?${params}`,
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