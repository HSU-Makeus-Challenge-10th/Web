import React, { createContext, useContext, useCallback, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

interface AuthContextType {
    accessToken: string | null;
    login: (token: string) => void;
    logout: () => void;
    isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [accessToken, setAccessToken, removeAccessToken] = useLocalStorage<string | null>('accessToken', null);

    const login = useCallback((token: string) => {
        setAccessToken(token);
    }, [setAccessToken]);

    const logout = useCallback(() => {
        removeAccessToken();
    }, [removeAccessToken]);

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