import { useParams } from "react-router-dom";
import MovieBanner from "../components/MovieBanner";
import PersonCard from "../components/PersonCard";
import type { Movie, Cast, Crew } from "../types/movie";
import { useEffect, useState } from "react";
import axios from "axios";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function MovieDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [cast, setCast] = useState<Cast[]>([]);
    const [crew, setCrew] = useState<Crew[]>([]);
    const [pending, setPending] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchMovieDetail = async () => {
            try {
                const { data } = await axios.get(`https://api.themoviedb.org/3/movie/${id}?language=ko-KR&append_to_response=credits`, {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                    },
                });

                setMovie(data);
                if (data.credits) {
                    setCast(data.credits.cast);
                    setCrew(data.credits.crew);
                }
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setPending(false);
            }
        };
        fetchMovieDetail();
    }, [id]);

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

