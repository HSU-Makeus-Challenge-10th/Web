import { useState } from 'react';
import { Heart, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LpEditModal from './LpEditModal';
import { useLpActions } from '../../hooks/lp/useLpActions';

interface LpInfoSectionProps {
    lp: any;
}

export const LpInfoSection = ({ lp }: LpInfoSectionProps) => {
    const { user } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const isAuthor = user && lp?.author?.id === user.id;
    const isLiked = lp?.likes?.some((like: any) => like.userId === user?.id);

    const { isDeleting, isTogglingLike, handleDelete, handleLikeClick } = useLpActions({
        lpId: lp.id,
        isLiked
    });

    return (
        <div className="bg-[#1e1e22] rounded-[32px] p-8 md:p-12 shadow-2xl mb-12">
            {/* 헤더 섹션 */}
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-[#ff007f] p-0.5">
                        <img
                            src={lp.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(lp.author?.name || 'user')}`}
                            alt={lp.author?.name}
                            className="w-full h-full rounded-full object-cover bg-[#2a2a2e]"
                        />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg leading-tight">{lp.author?.name || '익명'}</h3>
                        <span className="text-xs text-gray-500 font-medium">1일 전</span>
                    </div>
                </div>

                {isAuthor && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="p-2.5 text-gray-500 hover:text-[#ff007f] hover:bg-[#2a2a2e] rounded-full transition-all cursor-pointer"
                        >
                            <Pencil size={20} />
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="p-2.5 text-gray-500 hover:text-red-500 hover:bg-[#2a2a2e] rounded-full transition-all cursor-pointer"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                )}
            </div>

            {/* 제목 및 레코드판 섹션 */}
            <div className="flex flex-col items-center mb-12">
                <h1 className="text-3xl md:text-5xl font-black text-center mb-12 tracking-tight">
                    {lp.title}
                </h1>

                <div className="relative group">
                    <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-[#1a1a1e] rounded-2xl flex items-center justify-center p-6 shadow-inner border border-[#2a2a2e]">
                        <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border-4 border-[#121214] group-hover:rotate-[360deg] transition-transform duration-[10000ms] linear infinite">
                            <img
                                src={lp.thumbnail || 'https://via.placeholder.com/400?text=No+Image'}
                                alt={lp.title}
                                className="w-full h-full object-cover opacity-80"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 md:w-24 md:h-24 bg-[#1e1e22] rounded-full border-[8px] border-[#2a2a2e] shadow-inner" />
                            </div>
                        </div>
                    </div>
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-black/40 blur-2xl rounded-full" />
                </div>
            </div>

            {/* 본문 텍스트 */}
            <div className="max-w-2xl mx-auto text-center mb-12">
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-medium italic">
                    "{lp.content}"
                </p>
            </div>

            {/* 태그 섹션 */}
            {lp.tags && lp.tags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {lp.tags.map((tag: any) => (
                        <button key={tag.id} className="px-5 py-2 bg-[#2a2a2e] text-[#a0a0b0] rounded-full text-sm font-medium hover:bg-[#3a3a3e] hover:text-white transition-all cursor-pointer">
                            # {tag.name}
                        </button>
                    ))}
                </div>
            )}

            {/* 좋아요 섹션 */}
            <div className="flex flex-col items-center">
                <button
                    onClick={handleLikeClick}
                    disabled={isTogglingLike}
                    className="group flex flex-col items-center gap-2 cursor-pointer"
                >
                    <div className="p-4 rounded-full bg-[#1e1e22] hover:bg-[#2a2a2e] transition-all">
                        <Heart
                            size={32}
                            className={`${isLiked ? 'fill-[#ff007f] text-[#ff007f]' : 'text-[#ff007f]'} group-hover:scale-125 transition-transform`}
                        />
                    </div>
                    <span className="font-bold text-xl">{lp.likes?.length || 0}</span>
                </button>
            </div>

            {/* LP 수정 모달 */}
            {isEditModalOpen && (
                <LpEditModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    lp={lp}
                />
            )}
        </div>
    );
};
