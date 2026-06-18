import { memo, type FormEvent } from 'react';
import type { MovieLanguage } from '../../types/movie';

interface MovieSearchFormProps {
  query: string;
  includeAdult: boolean;
  language: MovieLanguage;
  onQueryChange: (query: string) => void;
  onIncludeAdultChange: (includeAdult: boolean) => void;
  onLanguageChange: (language: MovieLanguage) => void;
  onSubmit: () => void;
}

const languageOptions: { label: string; value: MovieLanguage }[] = [
  { label: '한국어', value: 'ko-KR' },
  { label: '영어', value: 'en-US' },
  { label: '일본어', value: 'ja-JP' },
];

const MovieSearchForm = ({
  query,
  includeAdult,
  language,
  onQueryChange,
  onIncludeAdultChange,
  onLanguageChange,
  onSubmit,
}: MovieSearchFormProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <section className="mx-auto mb-10 max-w-5xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-[1fr_auto_auto_auto] md:items-end">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-gray-700">영화 제목</span>
          <input
            type="text"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="영화 제목을 입력하세요"
            className="h-12 rounded-lg border border-gray-300 px-4 text-gray-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
          />
        </label>

        <label className="flex h-12 items-center gap-2 rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={includeAdult}
            onChange={(event) => onIncludeAdultChange(event.target.checked)}
            className="h-4 w-4 accent-pink-500"
          />
          성인 콘텐츠 포함
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-gray-700">언어</span>
          <select
            value={language}
            onChange={(event) => onLanguageChange(event.target.value as MovieLanguage)}
            className="h-12 rounded-lg border border-gray-300 px-4 text-gray-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
          >
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} ({option.value})
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="h-12 rounded-lg bg-pink-500 px-6 font-semibold text-white transition hover:bg-pink-600"
        >
          검색
        </button>
      </form>
    </section>
  );
};

export default memo(MovieSearchForm);
