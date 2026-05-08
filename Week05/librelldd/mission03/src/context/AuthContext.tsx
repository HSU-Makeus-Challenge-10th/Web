import { createContext, useContext, useState, type ReactNode } from 'react';
import type { RequestLoginDto, RequestSignupDto } from "../types/auth";
import { postSignin } from "../apis/auth";
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEY } from '../constants/key';

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    login: (data: RequestLoginDto) => Promise<void>;
    signup: (data: RequestSignupDto) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();

    const { getItem: getAccessToken, setItem: setAccessTokenStorage, removeItem: removeAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const { getItem: getRefreshToken, setItem: setRefreshTokenStorage, removeItem: removeRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    const [accessToken, setAccessToken] = useState<string | null>(getAccessToken() as string | null);
    const [refreshToken, setRefreshToken] = useState<string | null>(getRefreshToken() as string | null);

    const login = async (signinData: RequestLoginDto) => {
        console.log("AuthContext: login 요청 시작", signinData);
        try {
            const response = await postSignin(signinData);
            console.log("AuthContext: 서버 응답 수신", response);

            const resultData = response.data;
            
            if (resultData && (resultData.accessToken || resultData.refreshToken)) {
                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = resultData;

                console.log("AuthContext: 토큰 저장 및 상태 업데이트");
                setAccessTokenStorage(newAccessToken);
                setRefreshTokenStorage(newRefreshToken);

                setAccessToken(newAccessToken);
                setRefreshToken(newRefreshToken);

                alert("로그인 성공!");
                navigate("/my");
            } else {
                console.error("AuthContext: 응답에 토큰 정보가 없습니다.", response);
                alert("로그인에 실패했습니다. 서버 응답 형식을 확인하세요.");
            }
        } catch (error) {
            console.error("AuthContext: 로그인 중 오류 발생", error);
            throw error;
        }
    };

    const signup = async (data: RequestSignupDto) => {
        // 회원가입 로직
    };

    const logout = () => {
        removeAccessToken();
        removeRefreshToken();
        setAccessToken(null);
        setRefreshToken(null);
    };

    return (
        
        <AuthContext.Provider value={{ accessToken, refreshToken, login, signup, logout }}>
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