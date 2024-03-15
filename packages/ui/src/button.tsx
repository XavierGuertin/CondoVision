import * as React from "react";
import {
    TouchableOpacity,
    StyleSheet,
    GestureResponderEvent,
    Text,
} from "react-native";

export interface ButtonProps {
    text: string;
    onClick?: (event: GestureResponderEvent) => void;
}

export function Button({ text, onClick }: ButtonProps) {
    return (
        <TouchableOpacity style={styles.button} onPress={onClick}>
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        maxWidth: 200,
        marginBottom: 10,
        marginTop: 10,
        borderRadius: 10,
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 30,
        paddingRight: 30,
        backgroundColor: "#2f80ed",
        borderColor: "black",
        borderWidth: 1,
    },
    text: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 17,
    },
});