import axios from 'axios';

export const getTmdbToken = () => {
    return import.meta.env.VITE_TMDB_TOKEN;
};

export const getTmdbHeaders = () => {
    return {
        Authorization: `Bearer ${getTmdbToken()}`,
    };
};

const tmdbApi = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default tmdbApi;
