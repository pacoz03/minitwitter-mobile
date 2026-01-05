import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommentItem from '../../components/CommentItem';
import PostItem from '../../components/PostItem';
import { useAuth } from '../../context/AuthContext';
import { commentsService, postsService } from '../../services/api';
import { Comment, Post } from '../../types/posts';

type Tab = 'posts' | 'comments' | 'likes';

export default function ProfileScreen() {
    const { user, signOut, checkUser } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('posts');
    
    const [posts, setPosts] = useState<Post[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [likedPosts, setLikedPosts] = useState<Post[]>([]);
    
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            await checkUser(); 

            const [userPostsRes, userComments, userLikes] = await Promise.all([
                postsService.getByUser(user.id.toString()),
                commentsService.getUserComments(user.id.toString()),
                postsService.getLikedPosts(user.id.toString())
            ]);

            setPosts(userPostsRes.items);
            setComments(userComments);
            setLikedPosts(userLikes);

        } catch (error) {
            console.error("Failed to fetch profile data", error);
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id, checkUser]);

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData])
    );

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Logout", style: "destructive", onPress: signOut }
            ]
        );
    };

    const handleDeletePost = (id: string) => {
        setPosts(prev => prev.filter(p => p.id !== id));
        setLikedPosts(prev => prev.filter(p => p.id !== id));
    };

    const renderContent = () => {
        if (loading) {
            return (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#1d9bf0" />
                </View>
            );
        }

        switch (activeTab) {
            case 'posts':
                return (
                    <FlatList
                        data={posts}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => <PostItem post={item} onDelete={handleDeletePost} />}
                        scrollEnabled={false}
                        ListEmptyComponent={<Text style={styles.emptyText}>No posts yet.</Text>}
                    />
                );
            case 'comments':
                return (
                    <FlatList
                        data={comments}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => <CommentItem comment={item} />}
                        scrollEnabled={false}
                        ListEmptyComponent={<Text style={styles.emptyText}>No comments yet.</Text>}
                    />
                );
            case 'likes':
                return (
                    <FlatList
                        data={likedPosts}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => <PostItem post={item} onDelete={handleDeletePost} />}
                        scrollEnabled={false}
                        ListEmptyComponent={<Text style={styles.emptyText}>No likes yet.</Text>}
                    />
                );
        }
    };

    if (!user) return null;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.profileCard}>
                    <Text style={styles.cardTitle}>Informazioni utente</Text>
                    <Text style={styles.cardSubtitle}>I tuoi dati personali</Text>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Username</Text>
                        <Text style={styles.value}>@{user.username}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Email</Text>
                        <Text style={styles.value}>{user.email}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Bibliografia/Bio</Text>
                        {user.bio ? (
                            <Text style={styles.bioText}>{user.bio}</Text>
                        ) : (
                            <View>
                                <Text style={styles.bioPlaceholder}>Nessuna bio aggiunta.</Text>
                                {/* <TouchableOpacity onPress={() => {}}>
                                    <Text style={styles.addBioLink}>Aggiungine una!</Text>
                                </TouchableOpacity> */}
                            </View>
                        )}
                    </View>

                    <TouchableOpacity style={styles.editButton} onPress={() => router.push('/profile/edit')}>
                        <Ionicons name="create-outline" size={20} color="#fff" style={{marginRight: 8}} />
                        <Text style={styles.editButtonText}>Modifica profilo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                         <Ionicons name="log-out-outline" size={20} color="#fff" style={{marginRight: 8}} />
                        <Text style={styles.logoutButtonText}>Esci dall&apos;account</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.tabsContainer}>
                    <TouchableOpacity 
                        style={[styles.tab, activeTab === 'posts' && styles.activeTab]} 
                        onPress={() => setActiveTab('posts')}
                    >
                        <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
                            Post ({posts.length})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.tab, activeTab === 'comments' && styles.activeTab]} 
                        onPress={() => setActiveTab('comments')}
                    >
                        <Text style={[styles.tabText, activeTab === 'comments' && styles.activeTabText]}>
                            Commenti ({comments.length})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.tab, activeTab === 'likes' && styles.activeTab]} 
                        onPress={() => setActiveTab('likes')}
                    >
                        <Text style={[styles.tabText, activeTab === 'likes' && styles.activeTabText]}>
                            Mi piace ({likedPosts.length})
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.contentContainer}>
                    {renderContent()}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    scrollView: {
        flex: 1,
    },
    profileCard: {
        margin: 15,
        padding: 20,
        borderRadius: 4,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 5,
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#8899a6',
        marginBottom: 20,
    },
    infoRow: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        color: '#8899a6',
        marginBottom: 2,
    },
    value: {
        fontSize: 18,
        color: '#ffffff',
        fontWeight: '500',
    },
    bioText: {
        fontSize: 16,
        color: '#ffffff',
        fontStyle: 'italic',
    },
    bioPlaceholder: {
        fontSize: 16,
        color: '#8899a6',
        fontStyle: 'italic',
    },
    addBioLink: {
        fontSize: 16,
        color: '#1d9bf0',
        fontWeight: 'bold',
        marginTop: 2,
    },
    editButton: {
        backgroundColor: '#1d9bf0',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 4,
        marginTop: 10,
        marginBottom: 10,
    },
    editButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: '#d32f2f', 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 4,
    },
    logoutButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    tabsContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
        paddingHorizontal: 15,
        justifyContent: 'space-around',
    },
    tab: {
        paddingVertical: 15,
    },
    activeTab: {
        borderBottomWidth: 3,
        borderBottomColor: '#ffffff',  
    },
    tabText: {
        fontSize: 16,
        color: '#71767b',
        fontWeight: 'bold',
    },
    activeTabText: {
        color: '#ffffff',
    },
    contentContainer: {
        flex: 1,
    },
    centerContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        color: '#71767b',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    }
});
