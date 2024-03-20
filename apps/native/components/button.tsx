import * as React from "react";
import { TouchableOpacity, StyleSheet, Text, GestureResponderEvent } from "react-native";

/**
 * ButtonProps defines the properties for the Button component.
 * @prop {string} text - The text to display on the button.
 * @prop {(event: GestureResponderEvent) => void} [onClick] - The function to call when the button is pressed.
 */
export interface ButtonProps {
    text: string;
    onClick?: (event: GestureResponderEvent) => void;
}

/**
 * A reusable button component for the application.
 * @param {ButtonProps} props - The properties passed to the Button component.
 * @returns A custom styled TouchableOpacity component acting as a button.
 */
export function Button({ text, onClick }: ButtonProps) {
    return (
        <TouchableOpacity style={styles.button} onPress={onClick}>
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    );
}

// Styles for the Button component
const styles = StyleSheet.create({
    button: {
        maxWidth: 200,
        textAlign: "center",
        borderRadius: 10,
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 30,
        paddingRight: 30,
        fontSize: 15, // Change the value to a number
        backgroundColor: "#2f80ed",
    },
    text: {
        color: "white",
    },
});