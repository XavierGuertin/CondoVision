import React, {useEffect, useState} from 'react';
import {MapComponent} from "../components/MapComponent";
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export function MapScreen({ navigation, route }) {

    const [ownedUnits, setOwnedUnits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setOwnedUnits(route.params.properties);
    }, []);

    return (
        <View style={styles.container}>
            {/* Send user back to wherever they came from */}
            <View style={styles.header}>
                <TouchableOpacity id={"goBackBtn"} onPress={() => navigation.goBack()} style={styles.headerIcon}>
                    <FontAwesome5 name="times" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Building Locations</Text>
            </View>
                <View style={styles.mapContainer}>
                    <MapComponent data={ownedUnits} />
                </View>
        </View>
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
    mapContainer: {
        height: '90%',
        justifyContent: 'flex-end',
        position: 'absolute',
        bottom: 0, // force map to bottom
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 20,
    },
    headerIcon: {
        padding: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 20, // Added margin to space out the title from the icon
        alignItems: 'center'
    },
});

export default MapScreen;