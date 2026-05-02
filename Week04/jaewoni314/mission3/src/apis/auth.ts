import { API } from './axios';
import type { SignUpRequestBody } from '../types/auth/signup';
import type { LoginData, LoginResponse } from '../types/auth/login';
import axios from 'axios';

// 회원가입 API
export const signUp = async (data: SignUpRequestBody) => {
  try {
    const response = await API.post('/auth/signup', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.request && !error.response) {
        // 네트워크 연결 에러
        throw new Error('서버에 연결할 수 없습니다.');
      }
      // 서버 응답이 있는 경우 원본 에러 그대로 throw
      throw error;
    }
    throw new Error('요청 처리 중 오류가 발생했습니다.');
  }
};

// 로그인 API
export const signIn = async (data: LoginData): Promise<LoginResponse> => {
  try {
    const response = await API.post('/auth/signin', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.request && !error.response) {
        throw new Error('서버에 연결할 수 없습니다.');
      }
      throw error;
    }
    throw new Error('요청 처리 중 오류가 발생했습니다.');
  }
};
