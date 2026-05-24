import { Upload } from 'lucide-react';
import { useLpEdit } from '../../hooks/lp/useLpEdit';
import Modal from '../common/Modal';

interface LpEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    lp: any;
}

const LpEditModal = ({ isOpen, onClose, lp }: LpEditModalProps) => {
    const { state, refs, actions } = useLpEdit({ lp, isOpen, onClose });

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="LP 수정" zIndex="z-[300]">
            <div className="flex flex-col items-center space-y-6">
                <div
                    className="w-40 h-40 rounded-full border-2 border-dashed border-gray-500 flex items-center justify-center cursor-pointer overflow-hidden relative group"
                    onClick={() => refs.fileInputRef.current?.click()}
                >
                    {state.imagePreview ? (
                        <>
                            <img src={state.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center transition-all">
                                <Upload className="text-white w-8 h-8" />
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center text-gray-400">
                            <Upload className="w-8 h-8 mb-2" />
                            <span className="text-xs">사진 업로드</span>
                        </div>
                    )}
                    <input
                        type="file"
                        ref={refs.fileInputRef}
                        onChange={actions.handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                </div>

                <div className="w-full space-y-4">
                    <input
                        type="text"
                        placeholder="LP Name"
                        value={state.title}
                        onChange={(e) => actions.setTitle(e.target.value)}
                        className="w-full bg-[#111111] border border-gray-700 rounded-md p-3 text-white focus:outline-none focus:border-[#ff007f]"
                    />
                    <input
                        type="text"
                        placeholder="LP Content"
                        value={state.content}
                        onChange={(e) => actions.setContent(e.target.value)}
                        className="w-full bg-[#111111] border border-gray-700 rounded-md p-3 text-white focus:outline-none focus:border-[#ff007f]"
                    />

                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="LP Tag"
                            value={state.tagInput}
                            onChange={(e) => actions.setTagInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && actions.handleAddTag()}
                            className="flex-1 bg-[#111111] border border-gray-700 rounded-md p-3 text-white focus:outline-none focus:border-[#ff007f]"
                        />
                        <button
                            onClick={actions.handleAddTag}
                            className="bg-[#99aab5] hover:bg-[#7289da] text-white px-4 rounded-md font-semibold transition-colors cursor-pointer"
                        >
                            Add
                        </button>
                    </div>

                    {state.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {state.tags.map(tag => (
                                <span key={tag} className="flex items-center bg-[#333333] px-3 py-1 rounded-full text-sm">
                                    {tag}
                                    <button
                                        onClick={() => actions.handleRemoveTag(tag)}
                                        className="ml-2 text-gray-400 hover:text-red-500 cursor-pointer"
                                    >
                                        &times;
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    onClick={actions.handleSave}
                    disabled={state.isSaveDisabled}
                    className={`w-full py-3 rounded-md font-bold transition-colors cursor-pointer ${
                        state.isSaveDisabled
                        ? 'bg-[#99aab5] text-gray-200 cursor-not-allowed'
                        : 'bg-[#ff007f] hover:bg-[#e60072] text-white'
                    }`}
                >
                    {state.isPending ? 'Saving...' : 'Save LP'}
                </button>
            </div>
        </Modal>
    );
};

export default LpEditModal;
