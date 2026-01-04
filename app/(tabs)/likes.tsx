import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Text } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import api, { postsService } from '../../services/api'; // Correct import: api is default
import { Post } from '../../types/posts';
import PostItem from '../../components/PostItem';
import { useAuth } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LikesScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [likedPosts, setLikedPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchLikedPosts = useCallback(async () => {
        if (!user) return;
        try {
            console.log('Fetching likes for user:', user.id);
            const posts = await postsService.getLikedPosts(user.id.toString());
            setLikedPosts(posts);
        } catch (error) {
            console.error("Failed to fetch likes", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user]);


    useFocusEffect(
        useCallback(() => {
            fetchLikedPosts();
        }, [fetchLikedPosts])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchLikedPosts();
    };

    const handleDeletePost = (id: string) => {
        setLikedPosts(current => current.filter(p => p.id !== id));
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#1d9bf0" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={likedPosts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <PostItem post={item} onDelete={handleDeletePost} />
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1d9bf0" />
                }
                ListEmptyComponent={
                    <View style={styles.centerContainer}>
                        <Text style={styles.emptyText}>You haven&apos;t liked any posts yet.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    header: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
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
    emptyText: {
        color: '#71767b',
        fontSize: 16,
    },
});
