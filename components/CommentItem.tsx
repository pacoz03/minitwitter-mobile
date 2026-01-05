import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Comment } from '../types/posts';
import StyledText from './StyledText';

interface CommentItemProps {
    comment: Comment;
}

export default function CommentItem({ comment }: CommentItemProps) {
    //console.log('CommentItem received comment:', JSON.stringify(comment, null, 2));
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>{comment.users?.username?.charAt(0).toUpperCase() || '?'}</Text>
                </View>
                <View>
                    <Text style={styles.username}>{comment.users?.username || 'Unknown User'}</Text>
                    <Text style={styles.date}>{new Date(comment.created_at).toLocaleDateString()}</Text>
                </View>
            </View>
            <StyledText content={comment.content} style={styles.content} />
        </View>
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
        alignItems: 'center',
        marginBottom: 8,
    },
    avatarPlaceholder: {
        width: 32,
        height: 32,
        borderRadius: 4,
        backgroundColor: '#333333',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    avatarText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    username: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#ffffff',
    },
    date: {
        color: '#71767b',
        fontSize: 12,
    },
    content: {
        fontSize: 15,
        lineHeight: 20,
        color: '#ffffff',
    },
});
