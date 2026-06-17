import type { MovieLanguage } from "../types/movie";
import Input from "./Input";
import LanguageSelector from "./LanguageSelector";

interface MovieFilterProps {
  query: string;
  includeAdult: boolean;
  language: MovieLanguage;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onIncludeAdultChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLanguageChange: (language: MovieLanguage) => void;
}

function MovieFilter({
  query,
  includeAdult,
  language,
  onSubmit,
  onQueryChange,
  onIncludeAdultChange,
  onLanguageChange,
}: MovieFilterProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow"
    >
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-semibold text-gray-700">
            영화 제목
          </label>
          <Input value={query} onChange={onQueryChange} />
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={includeAdult}
              onChange={onIncludeAdultChange}
            />
            성인 콘텐츠 표시
          </label>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-gray-700">
          언어
        </label>
        <LanguageSelector language={language} onChange={onLanguageChange} />
      </div>

      <button
        type="submit"
        className="rounded bg-blue-600 py-2 text-sm font-semibold text-white"
      >
        검색하기
      </button>
    </form>
  );
}

export default MovieFilter;
