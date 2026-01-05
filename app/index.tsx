import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LandingScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.content}>
                <View style={styles.header}>
                    <View>
                        <Ionicons name="logo-twitter" size={100} color="#1d9bf0" />
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
        borderRadius: 4, 
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

    },
    registerButtonText: {
        color: '#1d9bf0',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
