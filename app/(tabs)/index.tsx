import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen() {
    const { signOut, user } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome, {user?.username}!</Text>
            <TouchableOpacity onPress={signOut} style={styles.button}>
                <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        color: '#ffffff',
    },
    button: {
        backgroundColor: '#1d9bf0',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 4,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});