export interface User {
    id: number;
    username: string;
    email: string;
    has_otp?: boolean;
    bio?: string | null;
}

export interface RegisterResponse {
    user: User;
    token: string;
    otp_secret: string;
}

export interface LoginSuccessResponse {
    success: boolean;
    token: string;
    user: User;
}

export interface LoginOtpRequiredResponse {
    success: boolean;
    requires_otp: boolean;
    temp_token: string;
    message: string;
}

export type LoginResponse = LoginSuccessResponse | LoginOtpRequiredResponse;

export interface OtpSetupResponse {
    secret: string;
    otpauth_url: string;
}

export interface VerifyOtpResponse {
    success: boolean;
    token: string;
    user: User;
}
