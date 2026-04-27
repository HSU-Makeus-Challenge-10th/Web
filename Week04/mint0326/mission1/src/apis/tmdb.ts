import axios from 'axios';

export const getTmdbToken = () => {
    const token = import.meta.env.VITE_TMDB_TOKEN;
    if (!token) {
        throw new Error('TMDB token is not defined in environment variables');
    }
    return token;
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
