/// <reference types="vite/client" />

interface ImportMetaEnv {
  // 여기에 사용 중인 환경 변수 타입을 정의합니다.
  readonly VITE_TMDB_API_KEY: string;
  // 다른 환경 변수가 있다면 여기에 추가하세요.
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}