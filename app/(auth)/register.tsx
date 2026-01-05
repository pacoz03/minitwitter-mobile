import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { authService } from '../../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';

export default function RegisterScreen() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!username || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const response = await authService.register({ username, email, password });
            
            await SecureStore.setItemAsync('token', response.token);
            
            router.push({
                pathname: '/setup-otp',
                params: { 
                    secret: response.otp_secret, 
                    isRegistration: 'true' 
                }
            });

        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.error || 'Registration failed');
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
                <Text style={styles.title}>Create your account</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    placeholderTextColor="#82bde4ff"
                    value={username}
                    onChangeText={setUsername}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#82bde4ff"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
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

                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor="#82bde4ff"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
            </View>

            <View style={styles.footer}>
                <TouchableOpacity 
                    style={[styles.button, (!username || !email || !password || password !== confirmPassword) && styles.buttonDisabled]} 
                    onPress={handleRegister}
                    disabled={loading || !username || !email || !password || password !== confirmPassword}
                >
                    {loading ? (
                        <ActivityIndicator color="#1d9bf0" />
                    ) : (
                        <Text style={styles.buttonText}>Sign up</Text>
                    )}
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
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});