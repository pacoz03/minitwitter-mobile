import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { authService } from '../services/api';
// import { useAuth } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';

export default function RegisterScreen() {
    const router = useRouter();
    // const { signIn } = useAuth(); 
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
            
            // Navigate to OTP Setup
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
                <View style={styles.logoPlaceholder}>
                     <Text style={styles.logoText}>M</Text>
                </View>
                <View style={{width: 50}} /> 
            </View>

            <View style={styles.form}>
                <Text style={styles.title}>Create your account</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    placeholderTextColor="#71767b"
                    value={username}
                    onChangeText={setUsername}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#71767b"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
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
                    style={[styles.button, (!username || !email || !password) && styles.buttonDisabled]} 
                    onPress={handleRegister}
                    disabled={loading || !username || !email || !password}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
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
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: 'bold',
    },
});