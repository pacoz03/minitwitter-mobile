import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function LandingScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.content}>
                <View style={styles.header}>
                    {/* Placeholder for Logo */}
                    <View style={styles.logoPlaceholder}>
                        <Text style={styles.logoText}>M</Text>
                    </View>
                    <Text style={styles.title}>MiniTwitter</Text>
                    <Text style={styles.subtitle}>See what&apos;s happening in the world right now.</Text>
                </View>

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity 
                        style={[styles.button, styles.loginButton]} 
                        onPress={() => router.push('/login')}
                    >
                        <Text style={styles.loginButtonText}>Log in</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.button, styles.registerButton]} 
                        onPress={() => router.push('/register')}
                    >
                        <Text style={styles.registerButtonText}>Create account</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 30,
    },
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 8, // Less rounded
        backgroundColor: '#1d9bf0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    logoText: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 10,
        color: '#ffffff',
    },
    subtitle: {
        fontSize: 16,
        color: '#71767b',
        textAlign: 'center',
    },
    buttonsContainer: {
        width: '100%',
        gap: 15,
        marginBottom: 20,
    },
    button: {
        paddingVertical: 15,
        borderRadius: 4, // Less rounded
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginButton: {
        backgroundColor: '#1d9bf0',
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    registerButton: {
        backgroundColor: '#000000',
        borderWidth: 1,
        borderColor: '#536471',
    },
    registerButtonText: {
        color: '#1d9bf0',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
