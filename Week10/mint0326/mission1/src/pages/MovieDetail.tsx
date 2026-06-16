import { useParams, useNavigate } from 'react-router-dom';

export default function MovieDetail() {
  const { movieId } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>영화 상세 페이지</h1>
      <p>현재 영화 ID: {movieId}</p>
      <button 
        onClick={() => navigate(-1)}
        style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
      >
        뒤로 가기
      </button>
    </div>
  );
}
