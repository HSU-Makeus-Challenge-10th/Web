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
    <div className="transform rounded-2xl border border-gray-300 bg-white p-6 shadow-xl transition-all hover:shadow-2xl">
      <div className="flex flex-col gap-6">
        <div className="w-full">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            영화 제목
          </label>
          <Input value={query} onChange={setQuery} />
        </div>

        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              ⚙️옵션
            </label>
            <SelectBox
              checked={includeAdult}
              onChange={setIncludeAdult}
              label="성인 콘텐츠 표시"
              id="include_adult"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              🌏언어
            </label>
            <LanguageSelector
              value={language}
              onChange={setLanguage}
              options={LANGUAGE_OPTIONS}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            영화 검색
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieFilter;
