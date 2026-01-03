import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { LoginResponse, OtpSetupResponse, RegisterResponse, User, VerifyOtpResponse } from '../types/auth';

const BASE_URL = Platform.select({
    android: 'http://192.168.178.91:4000/api',
    ios: 'http://192.168.178.91:4000/api',
    default: 'http://192.168.178.91:4000/api',
});

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    register: async (data: any): Promise<RegisterResponse> => {
        const response = await api.post<RegisterResponse>('/auth/register', data);
        return response.data;
    },

    login: async (data: any): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/auth/login', data);
        return response.data;
    },

    verifyOtp: async (tempToken: string, otpToken: string): Promise<VerifyOtpResponse> => {
        const response = await api.post<VerifyOtpResponse>('/auth/verify-otp', {
            temp_token: tempToken,
            otp_token: otpToken,
        });
        return response.data;
    },

    getOtpSetup: async (): Promise<OtpSetupResponse> => {
        const response = await api.get<OtpSetupResponse>('/auth/otp/setup');
        return response.data;
    },

    getMe: async (): Promise<{ user: User }> => {
        const response = await api.get<{ user: User }>('/auth/me');
        return response.data;
    },
    
    logout: async () => {
        await SecureStore.deleteItemAsync('token');
        // Optional: Call backend logout if needed, but JWT is usually stateless client-side removal
        // await api.post('/auth/logout'); 
    }
};

export default api;
