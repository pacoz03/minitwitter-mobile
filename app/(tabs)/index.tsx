import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Text, Platform } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { postsService } from '../../services/api';
import { Post } from '../../types/posts';
import PostItem from '../../components/PostItem';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
    // const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchPosts = useCallback(async () => {
        try {
            const response = await postsService.getAll(50); // Fetch top 50 for now
            setPosts(response.items);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchPosts();
        }, [fetchPosts])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchPosts();
    };

    const handleDeletePost = (id: string) => {
        setPosts(current => current.filter(p => p.id !== id));
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#1d9bf0" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} >
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <PostItem post={item} onDelete={handleDeletePost} />
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1d9bf0" />
                }
                ListEmptyComponent={
                    <View style={styles.centerContainer}>
                        <Text style={styles.emptyText}>No posts yet.</Text>
                    </View>
                }
                contentInsetAdjustmentBehavior="automatic"
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
