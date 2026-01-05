import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { authService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoginOtpRequiredResponse, LoginSuccessResponse } from '../../types/auth';

export default function LoginScreen() {
    const router = useRouter();
    const { signIn } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const response = await authService.login({ username, password });
            
                if ('requires_otp' in response && response.requires_otp) {
                    const otpResponse = response as LoginOtpRequiredResponse;
                    router.push({
                        pathname: '/verify-otp',
                        params: { temp_token: otpResponse.temp_token }
                    });
                } else {
                    const successResponse = response as LoginSuccessResponse;
                    await signIn(successResponse.token, successResponse.user);
                }

        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.error || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Cancel</Text>
                </TouchableOpacity>
                <View style={styles.logoPlaceholder}>
                     <Text style={styles.logoText}>M</Text>
                </View>
                <View style={{width: 50}} /> 
            </View>

            <View style={styles.form}>
                <Text style={styles.title}>To get started, enter your username and password</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor="#71767b"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#71767b"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            <View style={styles.footer}>
                <TouchableOpacity 
                    style={[styles.button, (!username || !password) && styles.buttonDisabled]} 
                    onPress={handleLogin}
                    disabled={loading || !username || !password}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Log in</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/register')} style={styles.forgotPassword}>
                     <Text style={styles.forgotPasswordText}>Don&apos;t have an account? Sign up</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    backButton: {
        padding: 10,
    },
    backButtonText: {
        color: '#ffffff',
        fontSize: 16,
    },
    logoPlaceholder: {
        width: 30,
        height: 30,
        borderRadius: 4,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        color: '#000000',
        fontWeight: 'bold',
    },
    form: {
        marginTop: 40,
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#ffffff',
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
        paddingVertical: 15,
        fontSize: 18,
        marginBottom: 20,
        color: '#ffffff',
    },
    footer: {
        marginBottom: 20,
        justifyContent: 'flex-end',
    },
    button: {
        backgroundColor: '#ffffff',
        paddingVertical: 15,
        borderRadius: 4,
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    forgotPassword: {
        alignItems: 'center',
    },
    forgotPasswordText: {
        color: '#1d9bf0',
    }
});