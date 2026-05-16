import React, { useState, useRef } from "react";
import { X } from "lucide-react";
import usePostLp from "../hooks/mutations/usePostLp";

interface AddLpModalProps {
  onClose: () => void;
}

const AddLpModal: React.FC<AddLpModalProps> = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const postLpMutation = usePostLp();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !previewUrl) {
      alert("Please fill all fields and select an image.");
      return;
    }

    postLpMutation.mutate(
      {
        title,
        content,
        thumbnail: previewUrl,
        tags,
        published: true,
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: () => {
          alert("Failed to create LP.");
        },
      }
    );
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#242428] rounded-xl w-full max-w-[500px] p-6 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex justify-center mb-8 mt-4">
          <div
            className="relative w-[200px] h-[200px] rounded-full overflow-hidden cursor-pointer bg-black flex items-center justify-center group"
            style={{
              boxShadow: "0 0 20px rgba(0,0,0,0.9) inset, 0 0 15px rgba(0,0,0,0.5)",
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            {previewUrl && (
              <img
                src={previewUrl}
                alt="LP Preview"
                className="w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-60"
              />
            )}
            {!previewUrl && (
              <span className="text-gray-500 text-sm absolute">Click to select LP</span>
            )}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40px] h-[40px] bg-[#f4f4f5] rounded-full shadow-inner flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="LP Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent border border-gray-600 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
          />
          <input
            type="text"
            placeholder="LP Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-transparent border border-gray-600 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
          />

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="LP Tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              className="bg-transparent border border-gray-600 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors flex-1"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="bg-gray-300 text-black px-6 py-3 rounded-md font-medium hover:bg-white transition-colors cursor-pointer"
            >
              Add
            </button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, idx) => (
                <div
                  key={idx}
                  className="bg-[#36363E] text-gray-300 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={postLpMutation.isPending}
            className="w-full bg-gray-400 hover:bg-gray-300 text-black rounded-md py-3 mt-4 font-semibold transition-colors disabled:opacity-50 cursor-pointer"
          >
            {postLpMutation.isPending ? "Adding..." : "Add LP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLpModal;
