import StyledText from './StyledText';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { postsService } from '../services/api';
import { Post } from '../types/posts';

interface PostItemProps {
    post: Post;
    onDelete: (id: string) => void;
    commentCount?: number;
}

export default function PostItem({ post, onDelete, commentCount: externalCommentCount }: PostItemProps) {
    //console.log('PostItem received post:', JSON.stringify(post, null, 2));
    const router = useRouter();
    const { user } = useAuth();
    const [likesCount, setLikesCount] = useState(0);
    const [commentsCount, setCommentsCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [loadingAction, setLoadingAction] = useState(false);

    const isOwner = user?.id?.toString() === post.user_id?.toString();

    const fetchMetadata = useCallback(async () => {
        try {
            const [lCount, cCount, liked] = await Promise.all([
                postsService.getLikesCount(post.id),
                postsService.getCommentsCount(post.id),
                user ? postsService.getIsLikedByUser(post.id, user.id.toString()) : Promise.resolve(false)
            ]);
            setLikesCount(lCount);
            // If external count is provided, prefer it, otherwise use fetched
            if (externalCommentCount === undefined) {
                setCommentsCount(cCount);
            }
            setIsLiked(liked);
        } catch {
            console.error("Failed to fetch post metadata");
        }
    }, [post, user, externalCommentCount]);

    useEffect(() => {
        fetchMetadata();
    }, [fetchMetadata]);

    // Sync with external comment count if it changes
    useEffect(() => {
        if (externalCommentCount !== undefined) {
            setCommentsCount(externalCommentCount);
        }
    }, [externalCommentCount]);

    const handleLike = async () => {
        if (loadingAction) return;
        setLoadingAction(true);
        try {
            if (isLiked) {
                await postsService.removeLike(post.id);
                setLikesCount(prev => Math.max(0, prev - 1));
                setIsLiked(false);
            } else {
                await postsService.addLike(post.id);
                setLikesCount(prev => prev + 1);
                setIsLiked(true);
            }
        } catch (error) {
            Alert.alert('Error', error instanceof Error ? error.message : 'Failed to update like status');
        } finally {
            setLoadingAction(false);
        }
    };

    const handleDelete = async () => {
        Alert.alert(
            "Delete Post",
            "Are you sure you want to delete this post?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            await postsService.delete(post.id);
                            onDelete(post.id);
                        } catch {
                            Alert.alert('Error', 'Failed to delete post');
                        }
                    } 
                }
            ]
        );
    };

    const handlePress = () => {
        router.push(`/post/${post.id}`);
    };

    const handleEdit = () => {
        router.push(`/post/edit/${post.id}`);
    };

    return (
        <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.8}>
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <View style={styles.avatarPlaceholder}>
                         <Text style={styles.avatarText}>{post.users?.username?.charAt(0).toUpperCase() || '?'}</Text>
                    </View>
                    <View>
                        <Text style={styles.username}>{post.users?.username || 'Unknown User'}</Text>
                        <Text style={styles.date}>{new Date(post.created_at).toLocaleDateString()}</Text>
                    </View>
                </View>
                {isOwner && (
                    <View style={styles.ownerActions}>
                        <TouchableOpacity onPress={handleEdit} style={styles.actionIconButton}>
                            <Ionicons name="pencil-outline" size={20} color="#71767b" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDelete} style={styles.actionIconButton}>
                            <Ionicons name="trash-outline" size={20} color="#f4212e" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <StyledText content={post.content} style={styles.content} />

            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton} onPress={handlePress}>
                    <Ionicons name="chatbubble-outline" size={20} color="#71767b" />
                    <Text style={styles.actionText}>{commentsCount}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={handleLike} disabled={loadingAction}>
                    <Ionicons 
                        name={isLiked ? "heart" : "heart-outline"} 
                        size={20} 
                        color={isLiked ? "#f91880" : "#71767b"} 
                    />
                    <Text style={[
                        styles.actionText, 
                        isLiked && { color: "#f91880" }
                    ]}>
                        {likesCount}
                    </Text>
                </TouchableOpacity>

                {/* Share/Retweet placeholders could go here */}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
        padding: 15,
        backgroundColor: '#000000',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 4, // Less rounded
        backgroundColor: '#333333',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    avatarText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    username: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#ffffff',
    },
    date: {
        color: '#71767b',
        fontSize: 12,
    },
    ownerActions: {
        flexDirection: 'row',
        gap: 10,
    },
    actionIconButton: {
        padding: 5,
    },
    content: {
        fontSize: 16,
        lineHeight: 22,
        color: '#ffffff',
        marginBottom: 15,
    },
    actions: {
        flexDirection: 'row',
        gap: 30,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    actionText: {
        color: '#71767b',
        fontSize: 14,
    },
});
