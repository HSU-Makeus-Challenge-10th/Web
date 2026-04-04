import { useParams } from "react-router-dom";
import MovieBanner from "../components/MovieBanner";
import PersonCard from "../components/PersonCard";
import type { Movie, Cast, Crew, CreditResponse } from "../types/movie";
import { LoadingSpinner } from "../components/LoadingSpinner";
import useCustomFetch from "../hooks/useCustomFetch";

export default function MovieDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { data: movie, pending, error } = useCustomFetch<Movie & CreditResponse>(
        id ? `https://api.themoviedb.org/3/movie/${id}?language=ko-KR&append_to_response=credits` : ""
    );

    const cast: Cast[] = movie?.credits?.cast || [];
    const crew: Crew[] = movie?.credits?.crew || [];

    if (pending)
        return (
            <div className="bg-[#141413] min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );

    if (error || !movie)
        return (
            <div className="bg-[#141413] min-h-screen text-white text-center pt-20">
                데이터를 불러오는데 실패했습니다.
            </div>
        );

    const directors = crew.filter(person => person.job === "Director");

    return (
        <div className="bg-[#141413] min-h-screen text-white pb-20">
            <MovieBanner movie={movie} />

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* 제작진  */}
                {directors.length > 0 && (
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold mb-8 text-[#FFF8F0] tracking-tight">제작진</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-8">
                            {directors.map((person, idx) => (
                                <PersonCard
                                    key={`director-${idx}`}
                                    name={person.name}
                                    description={person.job}
                                    profilePath={person.profile_path}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* 출연진 */}
                <section>
                    <h2 className="text-3xl font-bold mb-8 text-[#FFF8F0] tracking-tight">출연진</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-8">
                        {cast.slice(0, 16).map((person, idx) => (
                            <PersonCard
                                key={`cast-${idx}`}
                                name={person.name}
                                description={person.character}
                                profilePath={person.profile_path}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

