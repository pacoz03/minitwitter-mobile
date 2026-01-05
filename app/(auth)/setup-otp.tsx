import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { useAuth } from '../../context/AuthContext';

export default function SetupOtpScreen() {
    const router = useRouter();
    const { secret } = useLocalSearchParams();
    const { checkUser } = useAuth();

    const copyToClipboard = async () => {
        if (typeof secret === 'string') {
            await Clipboard.setStringAsync(secret);
            Alert.alert('Copied', 'Secret key copied to clipboard');
        }
    };

    const handleDone = async () => {
        await checkUser();
        router.replace('/(tabs)');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                 <Text style={styles.title}>Setup 2FA</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.description}>
                    Scan the QR code in your authenticator app, or enter the secret key manually.
                </Text>

                <View style={styles.secretContainer}>
                    <Text style={styles.secretLabel}>Secret Key:</Text>
                    <Text style={styles.secretText}>{secret}</Text>
                    <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>
                        <Text style={styles.copyButtonText}>Copy</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.warning}>
                    Make sure to save this key in a safe place. You will need it to log in.
                </Text>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.button} onPress={handleDone}>
                    <Text style={styles.buttonText}>I&apos;ve added it, Continue</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        padding: 20,
    },
    header: {
        marginBottom: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        color: '#ffffff',
    },
    secretContainer: {
        backgroundColor: '#16181c',
        padding: 20,
        borderRadius: 4,
        alignItems: 'center',
        width: '100%',
        marginBottom: 30,
    },
    secretLabel: {
        fontSize: 14,
        color: '#71767b',
        marginBottom: 5,
    },
    secretText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#ffffff',
    },
    copyButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#202327',
        borderRadius: 4,
    },
    copyButtonText: {
        color: '#1d9bf0',
        fontWeight: 'bold',
    },
    warning: {
        fontSize: 14,
        color: '#71767b',
        textAlign: 'center',
        marginTop: 20,
    },
    footer: {
        paddingBottom: 20,
    },
    button: {
        backgroundColor: '#ffffff',
        paddingVertical: 15,
        borderRadius: 4,
        alignItems: 'center',
    },
    buttonText: {
        color: '#000000',
        fontSize: 18,
        fontWeight: 'bold',
    },
});