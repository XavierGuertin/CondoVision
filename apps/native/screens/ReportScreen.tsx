import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const SettingsScreen = ({navigation}: any) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Reports</Text>
            <Text>Hasn't been developed yet</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        marginBottom: 60,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    info: {
        fontSize: 18,
        marginBottom: 10,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: '80%',
    },
    logoutButton: {
        padding: 0,
        marginRight: -130,
        marginLeft: 130,
        marginBottom: 150,
        marginTop: -150,
    },
    logoutButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2074df',
    },
});

export default SettingsScreen