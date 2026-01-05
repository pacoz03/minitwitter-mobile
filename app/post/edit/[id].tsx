import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { postsService } from '../../../services/api';

export default function EditPostScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const postId = typeof id === 'string' ? id : '';

    useEffect(() => {
        if (!postId) {
            router.back();
            return;
        }

        const fetchPost = async () => {
            try {
                const post = await postsService.get(postId);
                setContent(post.content);
            } catch {
                Alert.alert('Error', 'Failed to load post');
                router.back();
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId, router]);

    const handleSave = async () => {
        if (!content.trim()) return;

        setSaving(true);
        try {
            await postsService.update(postId, content);
            Keyboard.dismiss();
            router.back();
        } catch {
            Alert.alert('Error', 'Failed to update post');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#1d9bf0" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleCancel}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Post</Text>
                <TouchableOpacity 
                    style={[styles.saveButton, !content.trim() && styles.saveButtonDisabled]} 
                    onPress={handleSave}
                    disabled={saving || !content.trim()}
                >
                    {saving ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <Text style={styles.saveButtonText}>Save</Text>
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
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    cancelText: {
        color: '#1d9bf0',
        fontSize: 16,
        fontWeight: 'bold',
    },
    postButton: {
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#1d9bf0',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 4,
        minWidth: 70,
        alignItems: 'center',
    },
    saveButtonDisabled: {
        opacity: 0.5,
    },
    saveButtonText: {
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
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
    },
});
