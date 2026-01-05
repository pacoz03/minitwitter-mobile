import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommentItem from '../../components/CommentItem';
import PostItem from '../../components/PostItem';
import { commentsService, postsService } from '../../services/api';
import { Comment, Post } from '../../types/posts';

import { useAuth } from '../../context/AuthContext';

export default function PostDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { user } = useAuth(); // Get current user
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [sending, setSending] = useState(false);

    const postId = typeof id === 'string' ? id : '';

    const fetchData = useCallback(async () => {
        if (!postId) return;
        setLoading(true);
        try {
            const [postData, commentsData] = await Promise.all([
                postsService.get(postId),
                commentsService.getAll(postId, 100)
            ]);
            setPost(postData);
            setComments(commentsData.items);
        } catch (error) {
            Alert.alert('Error', error instanceof Error ? error.message : 'Failed to load post');
            router.back();
        } finally {
            setLoading(false);
        }
    }, [postId, router]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSendComment = async () => {
        if (!newComment.trim() || !postId) return;
        setSending(true);
        try {
            const comment = await commentsService.create(postId, newComment);
            console.log(user);
            // Enrich with current user data for immediate display
            const enrichedComment = {
                ...comment,
                user: user ? {
                    id: user.id.toString(),
                    username: user.username
                } : undefined
            };

            setComments(prev => [enrichedComment, ...prev]);
            setNewComment('');
            Keyboard.dismiss();
        } catch (error) {
            Alert.alert('Error', error instanceof Error ? error.message : 'Failed to send comment');
        } finally {
            setSending(false);
        }
    };

    const handleDeletePost = () => {
        // If post is deleted from here, go back
        router.back();
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#1d9bf0" />
            </View>
        );
    }

    if (!post) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Post not found</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#ffffff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Post</Text>
                <View style={{ width: 24 }} />
            </View>

            <KeyboardAvoidingView 
                style={{ flex: 1 }} 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <FlatList
                    data={comments}
                    keyExtractor={(item) => item.id}
                    ListHeaderComponent={
                        <PostItem 
                            post={post} 
                            onDelete={handleDeletePost} 
                            commentCount={comments.length}
                        />
                    }
                    renderItem={({ item }) => <CommentItem comment={item} />}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No comments yet. Be the first to reply!</Text>
                        </View>
                    }
                />

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Tweet your reply"
                        placeholderTextColor="#71767b"
                        value={newComment}
                        onChangeText={setNewComment}
                        multiline
                    />
                    <TouchableOpacity 
                        style={[styles.sendButton, !newComment.trim() && styles.sendButtonDisabled]} 
                        onPress={handleSendComment}
                        disabled={sending || !newComment.trim()}
                    >
                        {sending ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            <Text style={styles.sendButtonText}>Reply</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
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
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
    },
    errorText: {
        color: '#71767b',
        fontSize: 16,
    },
    emptyContainer: {
        padding: 30,
        alignItems: 'center',
    },
    emptyText: {
        color: '#71767b',
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginBottom: 20,
        borderTopWidth: 1,
        borderTopColor: '#333333',
        backgroundColor: '#000000',
    },
    input: {
        flex: 1,
        color: '#ffffff',
        fontSize: 16,
        paddingHorizontal: 15,
        paddingVertical: 10,
        minHeight: 40,
        maxHeight: 100,
        backgroundColor: '#16181c',
        borderRadius: 4,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#1d9bf0',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
    sendButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
});
