# Week10 Mission1 - Movie Search

TMDB API를 활용한 영화 검색, 성인 콘텐츠 포함 여부, 언어 선택, 영화 상세 모달, SPA 배포 설정을 포함한 10주차 미션입니다.

## 실행

```bash
npm install
npm run dev
```

## 환경변수

`.env` 파일은 Git에 올리지 않습니다. `.env.example`을 참고해 아래 값을 설정해주세요.

```bash
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_API_KEY=your_tmdb_bearer_token
```

## 구현 내용

- `form` 기반 영화 검색 UI
- 영화 제목 입력 상태 관리
- 성인 콘텐츠 포함 여부를 `include_adult` 파라미터로 전달
- 한국어, 영어, 일본어 선택 값을 `language` 파라미터로 전달
- 영화 카드 클릭 시 상세 모달 표시
- IMDb 검색 버튼 새 탭 열기
- `/movies/:movieId` 라우팅 유지
- `vercel.json`으로 SPA 새로고침 404 방지
- `React.memo`, `useCallback`, `useMemo` 기반 렌더링 최적화

## 최적화 기록

[OPTIMIZATION.md](./OPTIMIZATION.md)에 영화 페이지 최적화 내용과 LP 페이지 성능 개선 포인트를 정리했습니다.
