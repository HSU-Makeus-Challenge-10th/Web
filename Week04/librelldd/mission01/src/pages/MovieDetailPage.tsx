import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MovieDetailPage = () => {
    const { movieId } = useParams<{ movieId: string }>();
    const [movieDetail, setMovieDetail] = useState<any>(null);
    const [credits, setCredits] = useState<any>(null);

    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                const options = {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
                    },
                };
                const [detailRes, creditsRes] = await Promise.all([
                    axios.get(`https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`, options),
                    axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`, options)
                ]);
                setMovieDetail(detailRes.data);
                setCredits(creditsRes.data);
            } catch (error) {
                console.error("데이터 로드 실패:", error);
            }
        };
        if (movieId) fetchMovieData();
    }, [movieId]);

    if (!movieDetail) return (
        <div className="min-h-screen bg-[#030005] flex items-center justify-center">
            <div className="animate-pulse text-purple-400 text-2xl font-Pretendard tracking-[0.2em]">LOADING...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#030005] text-purple-100 font-Pretendard selection:bg-purple-500/30 overflow-x-hidden relative">
            
            
            {movieDetail.backdrop_path && (
                <div 
                    className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500"
                    style={{ 
                        backgroundImage: `url(https://image.tmdb.org/t/p/original${movieDetail.backdrop_path})`,
                        opacity: 0.5, 
                    }}
                />
            )}
            
            
            <div className="fixed inset-0 bg-black/50 z-[1]" />

        
            <div className="relative z-10">
                {/* 1. 히어로 섹션 (상단 영화 정보) */}
                <div className="h-[80vh] w-full flex items-center">
                    <div className="max-w-6xl mx-auto px-8 w-full flex items-center gap-16">
                       
                        <img 
                            src={`https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`} 
                            className="hidden lg:block w-80 rounded-3xl shadow-[0_0_50px_rgba(139,92,246,0.3)] border border-purple-900/40 object-cover"
                            alt={movieDetail.title}
                        />
                        
                        <div className="flex flex-col gap-6">
                            <h1 className="text-4xl font-black tracking-tighter text-white drop-shadow-lg">
                                {movieDetail.title}
                            </h1>
                            
                            <div className="flex items-center gap-5 text-lg text-purple-100 font-light">
                                <span className="text-yellow-400 font-bold">★ {movieDetail.vote_average.toFixed(1)}</span>
                                <span className="opacity-30">|</span>
                                <span>{movieDetail.release_date?.split('-')[0]}</span>
                                <span className="opacity-30">|</span>
                                <div className="flex gap-2">
                                    {movieDetail.genres?.slice(0, 3).map((genre: any) => (
                                        <span key={genre.id} className="px-3 py-1 bg-purple-900/60 rounded-full text-xs border border-purple-700/50">
                                            {genre.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            <p className="text-purple-60 text-base leading-[2] max-w-2xl font-Pretendard line-clamp-5">
                                {movieDetail.overview || "설명할 수 없는 신비로운 이야기가 곧 시작됩니다."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. 하단 상세 정보 섹션 (출연진) */}
                <div className="max-w-6xl mx-auto  w-full">
                    <h2 className="text-3xl font-Pretendard tracking-[0.3em] uppercase mb-16 relative inline-block text-white">
                        Cast
                        <span className="absolute -bottom-3 left-0 w-full h-[1px] bg-gradient-to-r from-purple-500 to-transparent shadow-[0_0_8px_rgba(168,85,247,0.6)]"></span>
                    </h2>
                    
                    {/* 가로 스크롤 캐스트 리스트 */}
                    <div className="flex gap-12 overflow-x-auto pb-10 custom-scrollbar">
                        {credits?.cast?.slice(0, 15).map((person: any) => (
                            <div key={person.id} className="min-w-[160px] flex-shrink-0 group text-center">
                                
                                <div className="h-56 overflow-hidden rounded-full bg-purple-950/30 mb-5 border-2 border-transparent group-hover:border-purple-500/50 transition-all duration-500 shadow-xl">
                                    <img 
                                        src={person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : 'https://via.placeholder.com/185x278?text=No+Image'} 
                                        className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                                        alt={person.name}
                                    />
                                </div>
                                <p className="font-Pretendard text-purple-50 group-hover:text-purple-300 transition-colors duration-300">{person.name}</p>
                                <p className="text-sm text-purple-400/50 font-Pretendard mt-1 truncate px-2">{person.character}</p>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* 3. 푸터 */}
                <footer className="max-w-6xl mx-auto px-8 py-16 border-t border-purple-950/20 text-center">
                    <p className="text-purple-900 text-[10px] tracking-[0.8em] uppercase opacity-40">Cinema is a matter of what's in the frame and what's out.</p>
                </footer>
            </div>

<style>{`
    /* 1. 가로 스크롤바 영역 강제 표시 */
    .custom-scrollbar {
        overflow-x: auto !important;
        -webkit-overflow-scrolling: touch;
    }

    /* 2. 스크롤바 전체 높이 */
    .custom-scrollbar::-webkit-scrollbar {
        height: 10px !important; 
        display: block !important;
    }

    /* 3. 스크롤바가 지나가는 바닥  */
    .custom-scrollbar::-webkit-scrollbar-track {
        border-radius: 10px !important;
        margin: 0 40px !important; 
    }

    /* 4. 움직이는 막대기  */
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #8b5cf6 !important; 
        border-radius: 10px !important;
        border: 2px solid #030005 !important; 
    }

    
`}</style>
</div> 
    );
}; 

export default MovieDetailPage;