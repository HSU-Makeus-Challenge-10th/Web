import { createContext, useContext, useState, type PropsWithChildren } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";

interface AuthContextType {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    setAccessTokenInStorage: (token: string) => void;
    removeAccessTokenFromStorage: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const {
        getItem: getAccessTokenFromStorage,
        setItem: setAccessTokenInStorage,
        removeItem: removeAccessTokenFromStorage
    } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

    const [accessToken, setAccessToken] = useState<string | null>(getAccessTokenFromStorage());

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken, setAccessTokenInStorage, removeAccessTokenFromStorage }}>
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