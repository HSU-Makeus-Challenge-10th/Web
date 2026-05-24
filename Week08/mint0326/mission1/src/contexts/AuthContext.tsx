import React, { createContext, useContext, useCallback, useMemo, useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import api from '../api/axios';

interface UserInfo {
    id: number;
    email: string;
    name: string;
}

interface AuthContextType {
    accessToken: string | null;
    user: UserInfo | null;
    login: (tokens: { accessToken: string; refreshToken: string }) => void;
    logout: () => void;
    isLoggedIn: boolean;
    fetchUserInfo: () => Promise<void>;
    updateUser: (userInfo: Partial<UserInfo>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    // 액세스 토큰
    const [accessToken, setAccessToken, removeAccessToken] = useLocalStorage<string | null>('accessToken', null);
    // 리프래시 토큰
    const [refreshToken, setRefreshToken, removeRefreshToken] = useLocalStorage<string | null>('refreshToken', null);
    // 사용자 정보
    const [user, setUser] = useState<UserInfo | null>(null);

    const fetchUserInfo = useCallback(async () => {
        if (!accessToken) return;
        try {
            const response = await api.get('/v1/users/me');
            setUser(response.data.data); // CommonResponse 구조에 맞게 data 필드 접근
        } catch (error) {
            console.error('Failed to fetch user info:', error);
            setUser(null);
        }
    }, [accessToken]);

    useEffect(() => {
        if (accessToken) {
            fetchUserInfo();
        } else {
            setUser(null);
        }
    }, [accessToken, fetchUserInfo]);

    const login = useCallback((tokens: { accessToken: string; refreshToken: string }) => {
        setAccessToken(tokens.accessToken);
        setRefreshToken(tokens.refreshToken);
    }, [setAccessToken, setRefreshToken]);

    const logout = useCallback(() => {
        removeAccessToken();
        removeRefreshToken();
        setUser(null);
    }, [removeAccessToken, removeRefreshToken]);

    const updateUser = useCallback((userInfo: Partial<UserInfo>) => {
        setUser(prev => prev ? { ...prev, ...userInfo } : null);
    }, []);

    const isLoggedIn = useMemo(() => !!accessToken, [accessToken]);

    const value = useMemo(() => ({
        accessToken,
        user,
        login,
        logout,
        isLoggedIn,
        fetchUserInfo,
        updateUser
    }), [accessToken, user, login, logout, isLoggedIn, fetchUserInfo, updateUser]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};