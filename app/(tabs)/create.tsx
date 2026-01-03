import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ActivityIndicator, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { postsService } from '../../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreatePostScreen() {
    const router = useRouter();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePost = async () => {
        if (!content.trim()) return;

        setLoading(true);
        try {
            await postsService.create(content);
            setContent('');
            Keyboard.dismiss();
            router.push('/(tabs)');
        } catch {
            Alert.alert('Error', 'Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (content.trim()) {
            Alert.alert(
                'Discard Post?',
                'Are you sure you want to discard this post?',
                [
                    { text: 'Keep Editing', style: 'cancel' },
                    { 
                        text: 'Discard', 
                        style: 'destructive', 
                        onPress: () => {
                            setContent('');
                            Keyboard.dismiss();
                            router.push('/(tabs)');
                        }
                    }
                ]
            );
        } else {
            router.push('/(tabs)');
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleCancel}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.postButton, !content.trim() && styles.postButtonDisabled]} 
                    onPress={handlePost}
                    disabled={loading || !content.trim()}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <Text style={styles.postButtonText}>Post</Text>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="What's happening?"
                    placeholderTextColor="#71767b"
                    multiline
                    autoFocus
                    value={content}
                    onChangeText={setContent}
                    maxLength={280}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
    },
    cancelText: {
        color: '#ffffff',
        fontSize: 16,
    },
    postButton: {
        backgroundColor: '#1d9bf0',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        minWidth: 70,
        alignItems: 'center',
    },
    postButtonDisabled: {
        opacity: 0.5,
    },
    postButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    inputContainer: {
        flex: 1,
        padding: 15,
    },
    input: {
        fontSize: 18,
        color: '#ffffff',
        textAlignVertical: 'top',
        height: '100%',
    },
});
