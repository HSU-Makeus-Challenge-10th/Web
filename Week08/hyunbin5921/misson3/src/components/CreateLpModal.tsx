import { useState, type FormEvent, type ChangeEvent, type MouseEvent } from "react";

  const CreateLpModal = () => {
    const [isOpen, setIsOpen] = useState(false);

    const [lpName, setLpName] = useState("");
    const [lpContent, setLpContent] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    const handleBackdropClick = () => {
      handleClose();
    };

    const handleModalClick = (e: MouseEvent<HTMLDivElement>) => {
      // 백드롭 클릭이 아니라 모달 안쪽 클릭은 전파 막기
      e.stopPropagation();
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      setThumbnailFile(file);
    };

    const handleAddTag = () => {
      const trimmed = tagInput.trim();
      if (!trimmed) return;
      if (tags.includes(trimmed)) return;
      setTags((prev) => [...prev, trimmed]);
      setTagInput("");
    };

    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();

      // TODO: 실제 LP 생성 API에 맞게 body 만들어서 mutate 호출
      // 예: createLpMutate({ title: lpName, content: lpContent, tags, thumbnailFile })

      handleClose();
    };

    return (
      <>
        {/* 우측 하단 플로팅 + 버튼 */}
        <button
          type="button"
          onClick={handleOpen}
          className="fixed bottom-15 right-8 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-pink-500 text-3xl font-bold text-white shadow-xl hover:bg-pink-600"
        >
          +
        </button>

        {/* 모달 + 백드롭 */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/60"
            onClick={handleBackdropClick}
          >
            <div
              className="w-full max-w-lg rounded-2xl bg-[#2b2d33] px-8 py-6 text-white shadow-2xl"
              onClick={handleModalClick}
            >
              {/* 상단 X 버튼 */}
              <div className="mb-4 flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-xl text-gray-300 hover:text-white"
                >
                  ×
                </button>
              </div>

              {/* LP 디스크 스타일 영역 */}
              <div className="mb-6 flex justify-center">
                <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-black shadow-2xl">
                  <div className="absolute inset-0 rounded-full ring-8 ring-black/70 shadow-[0_0_40px_rgba(0,0,0,0.9)]" />
                  <div className="absolute h-16 w-16 rounded-full bg-gray-100" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* LP 이미지 업로드 */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-300">LP Thumbnail</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full rounded-md border border-gray-600 bg-transparent px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-gray-700 file:px-3 file:py-1 file:text-xs file:text-white hover:border-gray-400"
                  />
                  {thumbnailFile && (
                    <span className="text-xs text-gray-400">
                      선택된 파일: {thumbnailFile.name}
                    </span>
                  )}
                </div>

                {/* LP 이름 */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-300">LP Name</label>
                  <input
                    type="text"
                    value={lpName}
                    onChange={(e) => setLpName(e.target.value)}
                    className="w-full rounded-md border border-gray-600 bg-transparent px-3 py-2 text-sm focus:border-pink-500 focus:outline-none"
                  />
                </div>

                {/* LP 내용 */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-300">LP Content</label>
                  <textarea
                    value={lpContent}
                    onChange={(e) => setLpContent(e.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-gray-600 bg-transparent px-3 py-2 text-sm focus:border-pink-500 focus:outline-none"
                  />
                </div>

                {/* 태그 입력 + 추가 */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="mb-1 block text-xs text-gray-300">
                        LP Tag
                      </label>
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        className="w-full rounded-md border border-gray-600 bg-transparent px-3 py-2 text-sm focus:border-pink-500 focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="mt-5 whitespace-nowrap rounded-md bg-gray-500 px-4 py-2 text-xs font-semibold hover:bg-gray-400"
                    >
                      Add
                    </button>
                  </div>

                  {/* 추가된 태그 리스트 */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-gray-700 px-3 py-1 text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 제출 버튼 */}
                <button
                  type="submit"
                  className="mt-4 w-full rounded-md bg-gray-300 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-200"
                >
                  Add LP
                </button>
              </form>
            </div>
          </div>
        )}
      </>
    );
  };

  export default CreateLpModal;
