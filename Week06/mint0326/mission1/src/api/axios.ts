import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000', // 서버 세팅 문서에 적힌 URL 입력
});

// 요청 인터셉터: 모든 요청에 토큰 부착
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
    }
    return config;
});

// 응답 인터셉터: 401 에러 발생 시 토큰 갱신 로직 실행
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 401 에러이고 재시도한 적이 없는 요청일 때
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // 무한 루프 방지 플래그

            try {
                const refreshToken = localStorage.getItem('refreshToken');

                // Refresh Token으로 Access Token 갱신 요청
                const res = await axios.post('http://localhost:8000/v1/auth/refresh', {
                    refresh: JSON.parse(refreshToken || '')
                });

                const { accessToken: newAccessToken } = res.data;

                // 새로운 토큰 저장
                localStorage.setItem('accessToken', JSON.stringify(newAccessToken));

                // 실패했던 기존 요청의 헤더를 새 토큰으로 교체 후 재시도
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            }
            catch (refreshError) {
                // Refresh Token도 만료된 경우 로그아웃 처리
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;