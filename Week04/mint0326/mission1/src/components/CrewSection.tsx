import type { MovieCredits } from '../types/movie';

interface CrewSectionProps {
    credits: MovieCredits | null;
}

const CrewSection = ({ credits }: CrewSectionProps) => {
    if (!credits) return null;

    // 출연진 중 상위 10명
    const cast = credits.cast.slice(0, 10);
    // 제작진 중 감독만 추출
    const directors = credits.crew.filter(person => person.job === 'Director');

    // 합쳐서 렌더링 (또는 따로) - 사용자 요청 '감독 및 출연진' 타이틀에 맞춰 감독을 앞에 배치
    const displayList = [...directors, ...cast];

    // 기본 아바타 이미지 URL (좀 더 고화질의 일반적인 아바타)
    const DEFAULT_AVATAR = 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d1f9661336603a11-50be33d038.svg';

    return (
        <section className="max-w-7xl mx-auto px-6 mt-16 pb-20">
            <h2 className="text-3xl font-black mb-10 flex items-center text-white">
                <span className="w-8 h-1 bg-white/30 mr-4"></span>
                감독 및 출연진
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-8 gap-y-12 text-white">
                {displayList.map((person, idx) => {
                    const isDirector = 'job' in person && person.job === 'Director';
                    
                    return (
                        <div key={`${person.id}-${idx}`} className="group flex flex-col items-center">
                            <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden mb-4 border-2 border-white/10 group-hover:border-white/50 transition-all shadow-xl relative">
                                <img 
                                    src={person.profile_path 
                                        ? `https://image.tmdb.org/t/p/w200${person.profile_path}` 
                                        : DEFAULT_AVATAR} 
                                    alt={person.name} 
                                    className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ${!person.profile_path ? 'p-6 bg-white/5' : ''}`}
                                />
                                {isDirector && (
                                    <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm text-[10px] py-1 text-center font-bold text-yellow-500 uppercase tracking-tighter">
                                        Director
                                    </div>
                                )}
                            </div>
                            <h3 className="font-bold text-center line-clamp-1">{person.name}</h3>
                            <p className="text-sm text-gray-400 text-center line-clamp-1">
                                {isDirector ? '연출' : (person as any).character}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default CrewSection;