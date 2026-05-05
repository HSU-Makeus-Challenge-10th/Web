import React, { createContext, useContext, useCallback, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

interface AuthContextType {
    accessToken: string | null;
    login: (tokens: { accessToken: string; refreshToken: string }) => void;
    logout: () => void;
    isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    // 액세스 토큰
    const [accessToken, setAccessToken, removeAccessToken] = useLocalStorage<string | null>('accessToken', null);
    // 리프래시 토큰
    const [refreshToken, setRefreshToken, removeRefreshToken] = useLocalStorage<string | null>('refreshToken', null);

    const login = useCallback((tokens: { accessToken: string; refreshToken: string }) => {
        setAccessToken(tokens.accessToken);
        setRefreshToken(tokens.refreshToken);
    }, [setAccessToken, setRefreshToken]);

    const logout = useCallback(() => {
        removeAccessToken();
        removeRefreshToken();
    }, [removeAccessToken, removeRefreshToken]);

    const isLoggedIn = useMemo(() => !!accessToken, [accessToken]);

    const value = useMemo(() => ({
        accessToken,
        login,
        logout,
        isLoggedIn
    }), [accessToken, login, logout, isLoggedIn]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};