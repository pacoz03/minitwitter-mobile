import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types/auth';
import * as SecureStore from 'expo-secure-store';
import { authService } from '../services/api';
import { router } from 'expo-router';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    signIn: (token: string, user: User) => Promise<void>;
    signOut: () => Promise<void>;
    checkUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkUser = useCallback(async () => {
        try {
            const token = await SecureStore.getItemAsync('token');
            if (token) {
                const { user } = await authService.getMe();
                setUser(user);
            }
        } catch (error) {
            console.log('Error checking user', error);
            await SecureStore.deleteItemAsync('token');
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkUser();
    }, [checkUser]);

    const signIn = useCallback(async (token: string, newUser: User) => {
        await SecureStore.setItemAsync('token', token);
        setUser(newUser);
        router.replace('/(tabs)'); // Assuming we have a tabs layout for the main app
    }, []);

    const signOut = useCallback(async () => {
        await authService.logout();
        setUser(null);
        router.replace('/login');
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoading, signIn, signOut, checkUser }}>
            {children}
        </AuthContext.Provider>
    );
};
