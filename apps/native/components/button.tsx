// Button.js
// A reusable button component for React Native applications.
// This component displays a button with customizable text and an optional onClick event handler.

import React from 'react';
import { TouchableOpacity, StyleSheet, Text, GestureResponderEvent } from 'react-native';

// Props definition for the Button component.
export interface ButtonProps {
    text: string; // The text to display on the button.
    onClick?: (event: GestureResponderEvent) => void; // Optional click event handler.
}

// Button component
export function Button({ text, onClick }: ButtonProps) {
    return (
        <TouchableOpacity style={styles.button} onPress={onClick}>
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    );
}

// Styles for the Button component.
const styles = StyleSheet.create({
    button: {
        maxWidth: 200,
        borderRadius: 10,
        paddingVertical: 14, // Combined paddingTop and paddingBottom into paddingVertical for conciseness.
        paddingHorizontal: 30, // Combined paddingLeft and paddingRight into paddingHorizontal for conciseness.
        backgroundColor: "#2f80ed",
        alignItems: 'center', // Ensures text is centered within the button, as textAlign is not valid here.
        justifyContent: 'center', // Vertically centers the content (text) within the button.
    },
    text: {
        color: "white",
        fontSize: 15, // Correctly placed fontSize within the text style.
    },
});
