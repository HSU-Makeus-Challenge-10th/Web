import { createContext, useContext, useState, type PropsWithChildren } from "react";
import type { RequestLogin } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { login as loginAPI, logout as logoutAPI } from "../api/auth";

interface AuthContextType {
    accessToken: string | null;
    login: (signinData: RequestLogin) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const {
        getItem: getAccessTokenFromStorage,
        setItem: setAccessTokenInStorage,
        removeItem: removeAccessTokenFromStorage
    } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

    const [accessToken, setAccessToken] = useState<string | null>(getAccessTokenFromStorage());

    const login = async (signinData: RequestLogin) => {
        try {
            const { data } = await loginAPI(signinData);

            if (data) {
                const newAccessToken = data.accessToken;

                setAccessTokenInStorage(newAccessToken);

                setAccessToken(newAccessToken);
                alert('로그인에 성공했습니다.');
            }
        } catch (error) {
            console.error(error);
            alert('로그인에 실패했습니다.');
            throw error;
        }
    }

    const logout = async () => {
        try {
            await logoutAPI();
        } catch (error) {
            console.error(error);
        } finally {
            removeAccessTokenFromStorage();
            setAccessToken(null);
            window.location.href = '/';
        }
    };

    return (
        <AuthContext.Provider value={{ accessToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('AuthProvider 외부에서 사용되었습니다.');
    }

    return authContext;
};