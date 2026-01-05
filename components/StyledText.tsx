import React from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';

interface StyledTextProps {
    content: string;
    style?: StyleProp<TextStyle>;
}

export default function StyledText({ content, style }: StyledTextProps) {
    if (!content) return null;

    const parseUnderline = (text: string, baseKey: string) => {
         const underlineParts = text.split(/(_.+?_)/g);
         return underlineParts.map((part, index) => {
             const key = `${baseKey}-u-${index}`;
             if (part.startsWith('_') && part.endsWith('_') && part.length >= 4) {
                 return (
                     <Text key={key} style={{ textDecorationLine: 'underline' }}>
                         {part.slice(2, -2)}
                     </Text>
                 );
             }
             return <Text key={key}>{part}</Text>;
         });
    };

    const parseItalic = (text: string, baseKey: string) => {
        const italicParts = text.split(/(\*.+?\*)/g);
        return italicParts.map((part, index) => {
             const key = `${baseKey}-i-${index}`;
             if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
                return (
                    <Text key={key} style={{ fontStyle: 'italic' }}>
                        {parseUnderline(part.slice(1, -1), key)}
                    </Text>
                );
            }
            return parseUnderline(part, key);
        });
    };

    const parseBold = (text: string) => {
        // Split by bold (**...**)
        const boldParts = text.split(/(\*\*.+?\*\*)/g);
        
        return boldParts.map((part, index) => {
            const key = `b-${index}`;
            if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
                return (
                    <Text key={key} style={{ fontWeight: 'bold' }}>
                        {parseItalic(part.slice(2, -2), key)}
                    </Text>
                );
            }
            return parseItalic(part, key);
        });
    };

    return <Text style={style}>{parseBold(content)}</Text>;
}
