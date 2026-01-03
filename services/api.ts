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

export const postsService = {
    getAll: async (limit = 20, offset = 0): Promise<import('../types/posts').PostsListResponse> => {
        const response = await api.get('/posts', { params: { limit, offset } });
        console.log('API getAll Posts Response:', JSON.stringify(response.data, null, 2));
        return response.data;
    },

    create: async (content: string): Promise<import('../types/posts').Post> => {
        const response = await api.post('/posts', { content });
        console.log(response.data)
        return response.data;
    },

    update: async (id: string, content: string): Promise<import('../types/posts').Post> => {
        const response = await api.patch(`/posts/${id}`, { content });
        return response.data;
    },

    get: async (id: string): Promise<import('../types/posts').Post> => {
        const response = await api.get(`/posts/${id}`);
        return response.data;
    },

    delete: async (id: string) => {
        await api.delete(`/posts/${id}`);
    },

    getLikesCount: async (postId: string): Promise<number> => {
        const response = await api.get('/likes', { 
            params: { post_id: postId, count: 'true' } 
        });
        // API docs say: if count=true, returns { count: number }
        // But the schema example says "value": { "count": 42 }
        return (response.data as any).count;
    },

    getIsLikedByUser: async (postId: string, userId: string): Promise<boolean> => {
        const response = await api.get('/likes', {
            params: { post_id: postId, user_id: userId }
        });
        // Returns list. If items.length > 0, it is liked.
        return response.data.items && response.data.items.length > 0;
    },

    addLike: async (postId: string) => {
        await api.post('/likes', { post_id: postId });
    },

    removeLike: async (postId: string) => {
        // DELETE /likes uses a body. Axios delete second arg is config, so we need 'data' field.
        await api.delete('/likes', { data: { post_id: postId } });
    },

    getCommentsCount: async (postId: string): Promise<number> => {
        // To get count, we can fetch with limit=1 and read the 'count' field from metadata
        const response = await api.get('/comments', {
            params: { post_id: postId, limit: 1 }
        });
        return response.data.count;
    }
};

export const commentsService = {
    getAll: async (postId: string, limit = 20, offset = 0): Promise<import('../types/posts').CommentsListResponse> => {
        const response = await api.get('/comments', { 
            params: { post_id: postId, limit, offset } 
        });
        console.log('API getAll Comments Response:', JSON.stringify(response.data, null, 2));
        return response.data;
    },

    create: async (postId: string, content: string): Promise<import('../types/posts').Comment> => {
        const response = await api.post('/comments', { post_id: postId, content });
        console.log(response.data)
        return response.data;
    }
};

export default api;
