import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { RequestLoginDto, RequestSignupDto, ResponseMyInfoDto } from "../types/auth";
import { postSignin, getMyInfo } from "../apis/auth";
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEY } from '../constants/key';

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    user: ResponseMyInfoDto['data'] | null;
    login: (data: RequestLoginDto) => Promise<any>;
    handleLoginSuccess: (accessToken: string, refreshToken: string) => Promise<void>;
    signup: (data: RequestSignupDto) => Promise<void>;
    logout: () => void;
    withdraw: () => Promise<void>;
    updateUser: (updated: Partial<ResponseMyInfoDto['data']>) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();

    const { getItem: getAccessToken, setItem: setAccessTokenStorage, removeItem: removeAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const { getItem: getRefreshToken, setItem: setRefreshTokenStorage, removeItem: removeRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    const [accessToken, setAccessToken] = useState<string | null>(getAccessToken() as string | null);
    const [refreshToken, setRefreshToken] = useState<string | null>(getRefreshToken() as string | null);
    const [user, setUser] = useState<ResponseMyInfoDto['data'] | null>(null);

    // 내 정보 불러오기
    const fetchUser = async () => {
        try {
            const response = await getMyInfo();
            setUser(response.data);
        } catch (error) {
            console.error("사용자 정보 가져오기 실패:", error);
            // 토큰이 유효하지 않은 경우 로그아웃 처리
            if (accessToken) {
                logout();
            }
        }
    };

    // 마운트 시 혹은 토큰 변경 시 사용자 정보 로드
    useEffect(() => {
        if (accessToken) {
            fetchUser();
        } else {
            setUser(null);
        }
    }, [accessToken]);

    const handleLoginSuccess = async (newAccessToken: string, newRefreshToken: string) => {
        setAccessTokenStorage(newAccessToken);
        setRefreshTokenStorage(newRefreshToken);
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);

        try {
            const userInfo = await getMyInfo();
            setUser(userInfo.data);
        } catch (e) {
            console.error("로그인 후 사용자 정보 로드 실패", e);
        }
    };

    const login = async (signinData: RequestLoginDto) => {
        const response = await postSignin(signinData);
        return response;
    };

    const signup = async (_data: RequestSignupDto) => {
        // 회원가입 로직
    };

    const logout = () => {
        removeAccessToken();
        removeRefreshToken();
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
        navigate("/login");
    };

    const withdraw = async () => {
        removeAccessToken();
        removeRefreshToken();
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
        navigate("/login");
    };

    const updateUser = (updated: Partial<ResponseMyInfoDto['data']>) => {
        setUser(prev => prev ? { ...prev, ...updated } : null);
    };

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, user, login, handleLoginSuccess, signup, logout, withdraw, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("AuthProvider 외부에서 접근 할 수 없습니다.");
    }
    return context;
};
