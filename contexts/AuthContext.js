import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.origin !== 'http://localhost:8001') return;
            if (event.data && event.data.type === 'auth_success' && event.data.token) {
                localStorage.setItem('accessToken', event.data.token);
                window.location.reload();
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    useEffect(() => {
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken) {
            setToken(storedToken);
            fetch('http://localhost:8001/api/v1/users/me', {
                headers: { 'Authorization': `Bearer ${storedToken}` }
            })
            .then(res => res.ok ? res.json() : Promise.reject('トークンが無効です'))
            .then(data => setUser(data))
            .catch(() => {
                localStorage.removeItem('accessToken');
                setToken(null);
                setUser(null);
            })
            .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = () => window.open('http://localhost:8001/auth/login/google', 'loginWindow', 'width=500,height=600');
    const logout = () => {
        localStorage.removeItem('accessToken');
        setToken(null);
        setUser(null);
        window.location.reload();
    };

    return <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);