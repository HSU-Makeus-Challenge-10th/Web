import { LOCAL_STORAGE_KEY } from "../constants/key";

// --- Access Token 관련 함수 ---

/**
 * Local Storage에서 Access Token을 가져옵니다.
 * @returns Access Token (문자열 또는 null)
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
};

/**
 * Local Storage에 새로운 Access Token을 저장합니다.
 * @param token 저장할 Access Token
 */
export const setAccessToken = (token: string): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, token);
};

/**
 * Local Storage에서 Access Token을 제거합니다.
 */
export const removeAccessToken = (): void => {
  localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
};

// --- Refresh Token 관련 함수 ---

/**
 * Local Storage에서 Refresh Token을 가져옵니다.
 * @returns Refresh Token (문자열 또는 null)
 */
// export const getRefreshToken = (): string | null => {
//   return localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken);

// };
export const getRefreshToken = (): string | null => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken);

  if (token && token.startsWith('"') && token.endsWith('"')) {
    // 🚨 문제의 원인이었던 중복 따옴표를 제거합니다.
    return token.substring(1, token.length - 1);
  }

  return token; // 따옴표가 없거나, null인 경우 그대로 반환
};

/**
 * Local Storage에 새로운 Refresh Token을 저장합니다.
 * @param token 저장할 Refresh Token
 */
export const setRefreshToken = (token: string): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY.refreshToken, token);
};

/**
 * Local Storage에서 Refresh Token을 제거합니다.
 */
export const removeRefreshToken = (): void => {
  localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
};
