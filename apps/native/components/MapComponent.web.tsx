import React from 'react';
import {SafeAreaView, StyleSheet, TouchableOpacity, Text} from "react-native";

export const MapComponent = ({ data }) => {

    type Nav = {
        navigate: (value: string) => void;
    }

    const montrealCoord = {
        latitude: 45.50148637849399,
        longitude: -73.56833166744768,
        latitudeDelta: 0.3,
        longitudeDelta: 0.4,
    }

    const handleOnPress = () => {
        console.log("no map here")
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity id={"openedMapBtn"} style={styles.modalButton} onPress={handleOnPress}>
                <Text style={styles.modalButtonText}>No Map Here</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    text: {
        fontSize: 25,
        fontWeight: '500',
    },
    mapView: {
        height: '100%',
        width: '100%',
        minHeight: '80%',
        minWidth: '100%'
    },
    modalButton: {
        backgroundColor: '#2074df',
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    modalButtonText: {
        fontSize: 20,
        color: '#fff',
        fontWeight: "500",
    },
});

export default MapComponent;