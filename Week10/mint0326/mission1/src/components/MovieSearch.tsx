import React, { memo, FormEvent } from 'react';

interface MovieSearchProps {
  query: string;
  setQuery: (query: string) => void;
  includeAdult: boolean;
  setIncludeAdult: (include: boolean) => void;
  language: string;
  setLanguage: (lang: string) => void;
  onSearch: () => void;
}

const MovieSearch = memo(({
  query,
  setQuery,
  includeAdult,
  setIncludeAdult,
  language,
  setLanguage,
  onSearch
}: MovieSearchProps) => {
  console.log("MovieSearch 리렌더링됨");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form className="movie-search-form" onSubmit={handleSubmit}>
      <div className="search-input-group">
        <label className="input-label">
          <div className="label-title">🎬 영화 제목</div>
          <input
            type="text"
            placeholder="영화 제목을 입력하세요"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        
        <label className="input-label">
          <div className="label-title">⚙️ 옵션</div>
          <div className="checkbox-wrapper">
            <input
              type="checkbox"
              checked={includeAdult}
              onChange={(e) => setIncludeAdult(e.target.checked)}
            />
            <span>성인 콘텐츠 표시</span>
          </div>
        </label>
      </div>

      <div className="language-select-group">
        <label className="input-label">
          <div className="label-title">🌐 언어</div>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="ko-KR">한국어</option>
            <option value="en-US">영어</option>
            <option value="ja-JP">일본어</option>
          </select>
        </label>
      </div>

      <button type="submit" className="search-btn">
        🔍 검색하기
      </button>
    </form>
  );
});

export default MovieSearch;
