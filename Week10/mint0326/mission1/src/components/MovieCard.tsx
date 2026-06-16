import React, { memo } from 'react';
import type { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

const MovieCard = memo(({ movie, onClick }: MovieCardProps) => {
  console.log(`MovieCard 리렌더링됨: ${movie.title}`);

  const imageUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <div className="movie-card" onClick={() => onClick(movie)}>
      <div className="poster-wrapper">
        <img src={imageUrl} alt={movie.title} className="poster-image" />
        <div className="vote-badge">{movie.vote_average.toFixed(1)}</div>
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-date">{movie.release_date}</p>
        <p className="movie-overview">{movie.overview}</p>
      </div>
    </div>
  );
});

export default MovieCard;
