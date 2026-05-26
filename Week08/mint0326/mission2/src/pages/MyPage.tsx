import { Settings, Check, Upload } from 'lucide-react';
import { useProfile } from '../hooks/user/useProfile';

const MyPage = () => {
    const { state, refs, actions } = useProfile();

    if (state.isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <div className="w-full max-w-2xl bg-[#111111] rounded-3xl p-10 shadow-2xl">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    
                    {/* 아바타 영역 */}
                    <div className="relative group shrink-0">
                        <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-700 border-4 border-[#222]">
                            <img 
                                src={state.isEditing && state.imagePreview ? state.imagePreview : (state.userProfile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(state.userProfile?.name || 'user')}`)} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                            />
                            {state.isEditing && (
                                <div 
                                    className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer transition-opacity"
                                    onClick={() => refs.fileInputRef.current?.click()}
                                >
                                    <Upload className="text-white w-8 h-8" />
                                </div>
                            )}
                        </div>
                        <input 
                            type="file" 
                            ref={refs.fileInputRef} 
                            onChange={actions.handleFileChange} 
                            className="hidden" 
                            accept="image/*"
                        />
                    </div>

                    {/* 정보 영역 */}
                    <div className="flex-1 w-full space-y-4">
                        {state.isEditing ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="text" 
                                        value={state.name}
                                        onChange={(e) => actions.setName(e.target.value)}
                                        placeholder="이름"
                                        className="w-full bg-[#222] border border-gray-600 rounded-lg p-3 text-xl font-bold focus:border-[#ff007f] focus:outline-none"
                                    />
                                    <button 
                                        onClick={actions.handleSave}
                                        disabled={state.isPending || !state.name.trim()}
                                        className="p-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        <Check size={24} />
                                    </button>
                                </div>
                                
                                <input 
                                    type="text" 
                                    value={state.bio}
                                    onChange={(e) => actions.setBio(e.target.value)}
                                    placeholder="상태 메시지 (선택)"
                                    className="w-full bg-[#222] border border-gray-600 rounded-lg p-3 text-gray-300 focus:border-[#ff007f] focus:outline-none"
                                />
                                
                                <p className="text-gray-500 pl-1">{state.userProfile?.email}</p>
                                
                                <div className="flex justify-end mt-4">
                                    <button 
                                        onClick={actions.handleEditCancel}
                                        className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 cursor-pointer"
                                    >
                                        취소
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="flex items-center gap-4 mb-2">
                                    <h2 className="text-3xl font-bold">{state.userProfile?.name}</h2>
                                    <button 
                                        onClick={actions.handleEditStart}
                                        className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                                    >
                                        <Settings size={24} />
                                    </button>
                                </div>
                                <p className="text-gray-400 text-lg mb-2">{state.userProfile?.bio || '상태 메시지가 없습니다.'}</p>
                                <p className="text-gray-500">{state.userProfile?.email}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 하단 로그아웃 버튼 */}
                <div className="mt-12 pt-8 border-t border-[#333] flex justify-end">
                    <button
                        onClick={actions.handleLogout}
                        className="px-6 py-2 bg-[#111] border border-gray-600 text-gray-400 hover:text-white hover:border-white rounded-lg font-bold transition-colors cursor-pointer"
                    >
                        로그아웃
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyPage;