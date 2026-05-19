import { useState, useEffect } from 'react';
import { Settings, X } from 'lucide-react';
import useGetInfiniteLikedLpList from '../hooks/queries/useGetInfiniteLikedLpList';
import usePatchMyInfo from '../hooks/mutations/usePatchMyInfo';
import useGetMyInfo from '../hooks/queries/useGetMyInfo';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import defaultAvatar from '../images/defaultavatar.png';

const MyPage = () => {
    const { data: myInfoResponse, isLoading, isError } = useGetMyInfo();
    const data = myInfoResponse;

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editName, setEditName] = useState("");
    const [editBio, setEditBio] = useState("");
    const [editAvatar, setEditAvatar] = useState("");

    const patchMyInfoMutation = usePatchMyInfo();

    const {
        data: likedData,
        isFetching: isLikedFetching,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage
    } = useGetInfiniteLikedLpList(12);

    const { ref, inView } = useInView({
        threshold: 0,
    });

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const handleOpenEditModal = () => {
        if (data?.data) {
            setEditName(data.data.name || "");
            setEditBio(data.data.bio || "");
            setEditAvatar(data.data.avatar || "");
        }
        setIsEditModalOpen(true);
    };

    const handleSaveProfile = () => {
        patchMyInfoMutation.mutate(
            { name: editName, bio: editBio, avatar: editAvatar },
            {
                onSuccess: () => {
                    setIsEditModalOpen(false);
                }
            }
        );
    };

    if (isLoading) {
        return <div className="text-white text-center mt-20">로딩 중...</div>;
    }

    if (isError || !data) {
        return <div className="text-white text-center mt-20">에러가 발생했습니다.</div>
    }

    return (
        <div className="w-255 mx-auto pb-10">
            <div className="flex items-center gap-8 py-8 px-4">
                <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-full overflow-hidden shrink-0 bg-[#658872] border-4 border-transparent shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                    <img
                        src={data.data?.avatar || defaultAvatar}
                        alt={data.data?.name || "User Avatar"}
                        className="w-full h-full object-cover bg-gray-600"
                        onError={(e) => { e.currentTarget.src = defaultAvatar; }}
                    />
                </div>

                <div className="flex-1 flex flex-col justify-center gap-2">
                    <div className="flex justify-between items-center w-full">
                        <h2 className="text-gray-200 text-2xl sm:text-3xl font-medium">{data.data?.name}</h2>
                        <button
                            onClick={handleOpenEditModal}
                            aria-label="프로필 수정 열기"
                            title="프로필 수정"
                            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                        >
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-gray-400 text-sm sm:text-[15px] font-medium leading-relaxed">
                        {data.data?.bio || ""}
                    </p>
                    <p className="text-gray-500 text-xs sm:text-[14px]">
                        {data.data?.email}
                    </p>
                </div>
            </div>

            <div className="h-px bg-gray-800 w-full mt-2 mb-6" />

            <div className="grid grid-cols-3 gap-1 sm:gap-2">
                {likedData?.pages.map((page) =>
                    page.data.data.map((lp) => (
                        <Link to={`/lp/${lp.id}`} key={lp.id} className="aspect-square bg-[#1E1E21] relative group overflow-hidden hover:opacity-80 transition-opacity">
                            <img src={lp.thumbnail} alt={lp.title} className="w-full h-full object-cover" />
                        </Link>
                    ))
                )}

                {isLikedFetching && (
                    Array.from({ length: 6 }).map((_, idx) => (
                        <div key={idx} className="aspect-square bg-[#1E1E21] animate-pulse"></div>
                    ))
                )}
            </div>

            <div ref={ref} className="h-4 w-full mt-4"></div>

            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="edit-profile-title"
                        className="bg-[#242428] rounded-xl p-6 w-full max-w-md shadow-2xl relative"
                    >
                        <button
                            onClick={() => setIsEditModalOpen(false)}
                            aria-label="프로필 수정 닫기"
                            className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h3 id="edit-profile-title" className="text-white text-xl font-medium mb-6">프로필 수정</h3>

                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">이름</label>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full bg-transparent border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gray-400"
                                    placeholder="이름을 입력하세요"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-1">소개글 (선택)</label>
                                <textarea
                                    value={editBio}
                                    onChange={(e) => setEditBio(e.target.value)}
                                    className="w-full bg-transparent border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gray-400 resize-none h-20"
                                    placeholder="소개글을 입력하세요"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-1">프로필 사진 URL (선택)</label>
                                <input
                                    type="text"
                                    value={editAvatar}
                                    onChange={(e) => setEditAvatar(e.target.value)}
                                    className="w-full bg-transparent border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gray-400"
                                    placeholder="이미지 URL을 입력하세요"
                                />
                            </div>

                            <button
                                onClick={handleSaveProfile}
                                disabled={patchMyInfoMutation.isPending || !editName.trim()}
                                className="w-full bg-[#FF1E90] hover:bg-pink-600 text-white font-medium py-2 rounded-lg mt-4 disabled:opacity-50 transition-colors cursor-pointer"
                            >
                                {patchMyInfoMutation.isPending ? "저장 중..." : "저장"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MyPage;