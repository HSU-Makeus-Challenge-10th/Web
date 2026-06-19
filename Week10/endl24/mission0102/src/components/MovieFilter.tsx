import { useState } from "react";
import type { MovieFilters } from "../types/movie";
import { Input } from "./input";
import { SelectBox } from "./SelectBox";
import LanguageSelector from "./LanguageSelector";
import { LANGUAGE_OPTIONS } from "../constants/movie";

interface MovieFilterProps {
  onChange: (filter: MovieFilters) => void;
}

const MovieFilter = ({ onChange }: MovieFilterProps) => {
  const [query, setQuery] = useState<string>("");
  const [includeAdult, setIncludeAdult] = useState<boolean>(false);
  const [language, setLanguage] = useState("ko-KR");

  const handleSubmit = () => {
    const filters: MovieFilters = {
      query,
      include_adult: includeAdult,
      language,
    };
    onChange(filters);
  };

  return (
    <div className="rounded-3xl border-2 border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-8">
        <div className="w-full">
          <label className="mb-3 block text-sm font-extrabold tracking-tight text-zinc-800">
            🎬 영화 제목
          </label>
          <Input value={query} onChange={setQuery} onSubmit={handleSubmit} />
        </div>

        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="flex-1">
            <label className="mb-3 block text-sm font-extrabold tracking-tight text-zinc-800">
              ⚙️ 옵션
            </label>
            <SelectBox
              checked={includeAdult}
              onChange={setIncludeAdult}
              label="성인 콘텐츠 표시"
              id="include_adult"
              className="w-full cursor-pointer rounded-2xl border-2 border-zinc-200 bg-zinc-50 px-5 py-3 transition-all duration-300 hover:border-zinc-300 hover:bg-zinc-100"
            />
          </div>
          <div className="flex-1">
            <label className="mb-3 block text-sm font-extrabold tracking-tight text-zinc-800">
              🌏 언어
            </label>
            <LanguageSelector
              value={language}
              onChange={setLanguage}
              options={LANGUAGE_OPTIONS}
              className="w-full"
            />
          </div>
        </div>

        <div className="mt-2 flex justify-end">
          <button
            onClick={handleSubmit}
            className="rounded-2xl bg-violet-600 px-8 py-3.5 text-sm font-extrabold text-white transition-all duration-300 hover:bg-violet-700 hover:shadow-[0_10px_20px_-10px_rgba(139,92,246,0.6)] focus:outline-none focus:ring-4 focus:ring-violet-500/30 active:scale-[0.98]"
          >
            영화 검색
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieFilter;
