import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { RefreshCw, AlertCircle, Calendar, Heart } from 'lucide-react';

interface Tag {
    id: number;
    name: string;
}

interface LP {
    id: number;
    title: string;
    content: string;
    thumbnail: string;
    tags: Tag[];
    likes: any[];
    createdAt: string;
}

const HomePage = () => {
    const [sort, setSort] = useState<'desc' | 'asc'>('desc');

    const {
        data,
        isLoading,
        isError,
        refetch,
        isFetching
    } = useQuery({
        queryKey: ['lps', sort],
        queryFn: async () => {
            const response = await api.get(`/v1/lps?order=${sort}&limit=20`);
            return response.data.data.data;
        },
        staleTime: 5000,
        gcTime: 10 * 60 * 1000,
    });

    const toggleSort = () => {
        setSort(prev => prev === 'desc' ? 'asc' : 'desc');
    };

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-xl font-bold mb-2">데이터를 불러오지 못했습니다</h2>
                <p className="text-gray-400 mb-6">서버 상태를 확인하거나 잠시 후 다시 시도해 주세요.</p>
                <button
                    onClick={() => refetch()}
                    className="flex items-center gap-2 px-6 py-2 bg-[#ff007f] text-white rounded-full hover:bg-[#e60072] transition-colors cursor-pointer"
                >
                    <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                    재시도
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-10 px-4 md:px-0">
                <h1 className="text-3xl font-black tracking-tighter">LP 컬렉션</h1>
                <div className="flex bg-[#1a1a1a] rounded-full p-1 border border-[#2a2a2a]">
                    <button
                        onClick={() => setSort('desc')}
                        className={`px-6 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${sort === 'desc' ? 'bg-[#ff007f] text-white shadow-lg shadow-[#ff007f]/20' : 'text-gray-500 hover:text-white'}`}
                    >
                        최신순
                    </button>
                    <button
                        onClick={() => setSort('asc')}
                        className={`px-6 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${sort === 'asc' ? 'bg-[#ff007f] text-white shadow-lg shadow-[#ff007f]/20' : 'text-gray-500 hover:text-white'}`}
                    >
                        오래된순
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4 md:px-0">
                {isLoading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-[#121212] rounded-2xl overflow-hidden border border-[#1a1a1a] animate-pulse">
                            <div className="aspect-square bg-[#1a1a1a]" />
                            <div className="p-5 space-y-3">
                                <div className="h-5 bg-[#1a1a1a] rounded w-3/4" />
                                <div className="h-3 bg-[#1a1a1a] rounded w-full" />
                                <div className="h-3 bg-[#1a1a1a] rounded w-2/3" />
                            </div>
                        </div>
                    ))
                ) : (
                    data?.map((lp: LP) => (
                        <Link
                            to={`/lp/${lp.id}`}
                            key={lp.id}
                            className="group block bg-[#121212] rounded-2xl overflow-hidden border border-[#1a1a1a] hover:border-[#ff007f]/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#ff007f]/10"
                        >
                            <div className="relative aspect-square overflow-hidden">
                                <img
                                    src={lp.thumbnail || 'https://via.placeholder.com/400?text=No+Image'}
                                    alt={lp.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
                                    <h4 className="text-white font-bold text-lg mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{lp.title}</h4>
                                    <div className="flex items-center justify-between text-xs text-gray-300 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            <span>{new Date(lp.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Heart size={12} className="text-[#ff007f] fill-[#ff007f]" />
                                            <span>{lp.likes?.length || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                                {lp.tags.slice(0, 2).map(tag => (
                                    <span key={tag.id} className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                        #{tag.name}
                                    </span>
                                ))}
                                {lp.tags.length > 2 && <span className="text-[10px] text-gray-600">+{lp.tags.length - 2}</span>}
                            </div>
                        </Link>
                    ))
                )}
            </div>

            {!isLoading && data?.length === 0 && (
                <div className="text-center py-32 border-2 border-dashed border-[#1a1a1a] rounded-3xl">
                    <p className="text-gray-500 text-xl font-medium">컬렉션에 등록된 LP가 없습니다.</p>
                </div>
            )}
        </div>
    );
};

export default HomePage;
