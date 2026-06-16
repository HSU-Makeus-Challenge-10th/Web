import { memo } from 'react';
import type { Movie } from '../types';

interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
}

const MovieModal = memo(({ movie, onClose }: MovieModalProps) => {
  console.log("MovieModal 리렌더링됨");

  if (!movie) return null;

  const imageUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  const handleImdbSearch = () => {
    window.open(`https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-poster">
          <img src={imageUrl} alt={movie.title} />
        </div>
        <div className="modal-info">
          <h2 className="modal-title">{movie.title}</h2>
          <div className="modal-meta">
            <span className="rating">{movie.vote_average.toFixed(1)} <small>(114 평가)</small></span>
            <div className="meta-item">
              <span>개봉일</span>
              <span>{movie.release_date}</span>
            </div>
            <div className="meta-item">
              <span>인기도</span>
              <div className="popularity-bar">
                <div className="popularity-fill" style={{ width: `${Math.min(movie.popularity / 100, 100)}%` }}></div>
              </div>
            </div>
          </div>
          <div className="modal-overview">
            <h3>줄거리</h3>
            <p>{movie.overview || '줄거리가 제공되지 않습니다.'}</p>
          </div>
          <div className="modal-actions">
            <button className="imdb-btn" onClick={handleImdbSearch}>IMDb에서 검색</button>
            <button className="close-btn" onClick={onClose}>닫기</button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default MovieModal;
