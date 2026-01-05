import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { postsService } from '../../services/api';

export default function CreatePostScreen() {
    const router = useRouter();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [selection, setSelection] = useState({ start: 0, end: 0 });

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

    const insertFormat = (tag: string) => {
        const start = selection.start;
        const end = selection.end;
        const text = content;
        
        let newText = '';
        if (start === end) {
             // No selection, just insert tags at cursor
             newText = text.substring(0, start) + tag + tag + text.substring(end);
             // Move cursor between tags? Ideally yes, but simplified for now
        } else {
            // Wrap selection
            const selectedText = text.substring(start, end);
            newText = text.substring(0, start) + tag + selectedText + tag + text.substring(end);
        }
        
        setContent(newText);
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
                    onSelectionChange={(event) => setSelection(event.nativeEvent.selection)}
                />
                {/* Character count - excluding insertformat tags */}
                
                <Text style={{color: '#71767b', textAlign: 'right', marginBottom: 30}}>{content.replace(/\*\*|__|\*/g, '').length}/300</Text>
            </View>

            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"} 
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
                <View style={styles.toolbar}>
                    <TouchableOpacity onPress={() => insertFormat('**')} style={styles.toolButton}>
                        <Ionicons name="filter" size={24} color="#1d9bf0" /> 
                         <Text style={{fontWeight: 'bold', color: '#1d9bf0', marginLeft: 5}}>B</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => insertFormat('*')} style={styles.toolButton}>
                         <Text style={{fontStyle: 'italic', fontWeight: 'bold', fontSize: 18, color: '#1d9bf0'}}>I</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => insertFormat('__')} style={styles.toolButton}>
                        <Text style={{textDecorationLine: 'underline', fontWeight: 'bold', fontSize: 18, color: '#1d9bf0'}}>U</Text>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
    },
    cancelText: {
        color: '#1d9bf0',
        fontSize: 16,
        fontWeight: 'bold',
    },
    postButton: {
        backgroundColor: '#1d9bf0',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 4,
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
    toolbar: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#333333',
        backgroundColor: '#000000',
        alignItems: 'center',
        gap: 20
    },
    toolButton: {
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center'
    }
});
