import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';
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
            </View>

            <View style={styles.form}>
                <Text style={styles.title}>To get started, enter your username and password</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor="#82bde4ff"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#82bde4ff"
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
                        <ActivityIndicator color="#1d9bf0" />
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
        color: '#1d9bf0',
        fontWeight: 'bold',
        fontSize: 16,
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
        borderBottomColor: '#82bde4ff',
        paddingVertical: 15,
        fontSize: 18,
        marginBottom: 20,
        color: '#82bde4ff',
    },
    footer: {
        marginBottom: 20,
        justifyContent: 'flex-end',
    },
    button: {
        backgroundColor: '#1d9bf0',
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