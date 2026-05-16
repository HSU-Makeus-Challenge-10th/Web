import { useInView } from "react-intersection-observer";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import LpCard from "../components/LpCard";
import LpCardSkeleton from "../components/LpCardSkeleton";
import AddLpModal from "../components/AddLpModal";

const HomePage = () => {
    const [order, setOrder] = useState<"asc" | "desc">("desc");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, isFetching, hasNextPage, fetchNextPage } = useGetInfiniteLpList(10, "", order);

    const { ref, inView } = useInView({
        threshold: 0,
    })

    useEffect(() => {
        if (inView && hasNextPage && !isFetching) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetching, fetchNextPage])

    return (
        <>
            <div className="flex justify-end mb-5 w-full">
                <button
                    onClick={() => setOrder("asc")}
                    className={`border px-3 py-1 rounded-l-lg transition-colors cursor-pointer ${order === "asc" ? "bg-white text-black" : "bg-black text-white"}`}
                >
                    오래된순
                </button>
                <button
                    onClick={() => setOrder("desc")}
                    className={`border px-3 py-1 rounded-r-lg transition-colors cursor-pointer ${order === "desc" ? "bg-white text-black" : "bg-black text-white"}`}
                >
                    최신순
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {data?.pages.map((page) =>
                    page.data.data.map((lp) => <LpCard key={lp.id} lp={lp} />),
                )}
                {isFetching ? (
                    Array.from({ length: 10 }).map((_, index) => (
                        <LpCardSkeleton key={index} />
                    ))
                ) : (
                    <div ref={ref} className="mt-8 flex justify-center bg-white h-2 col-span-full"></div>
                )}
            </div>

            <button
                type='button'
                aria-label='LP 추가'
                title="LP 추가"
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-8 right-8 w-14 h-14 bg-[#FF1E90] hover:scale-105 rounded-full flex justify-center items-center shadow-[0_0_15px_rgba(255,30,144,0.5)] transition-transform cursor-pointer z-40"
            >
                <Plus className="w-7 h-7 text-white stroke-3" />
            </button>

            {isModalOpen && <AddLpModal onClose={() => setIsModalOpen(false)} />}
        </>

    );
}

export default HomePage
