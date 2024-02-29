import React from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View,
    Image,
    Text,
    TouchableOpacity,
} from 'react-native';

export default function HomeScreen({ navigation }: any) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.hero}>
                <Image
                    style={styles.heroImage}
                    source={require('../assets/logoBright.png')}
                    resizeMode="contain"
                />
            </View>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('PropertyManagement');
                }}>
                <View style={styles.button}>
                    <Text style={styles.buttonText}>Property Management</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.content}>
                <View style={styles.contentHeader}>
                    <Text style={styles.title}>
                        Manage Your Condos With{'\n'}with Condo Vision
                    </Text>
                    <Text style={styles.text}>
                        Condo Vision is a comprehensive condo management system designed for the modern era.
                        Our platform seamlessly integrates the needs of condo owners, rental users, and condo
                        management companies, offering a streamlined and intuitive experience.
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('Login');
                    }}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Log In</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'scroll'
    },
    title: {
        fontSize: 28,
        fontWeight: '500',
        color: '#281b52',
        textAlign: 'center',
        marginBottom: 12,
        lineHeight: 40,
    },
    text: {
        fontSize: 15,
        lineHeight: 24,
        fontWeight: '400',
        color: '#9992a7',
        textAlign: 'center',
    },
    /** Hero */
    hero: {
        margin: 12,
        borderRadius: 16,
        padding: 16,
    },
    heroImage: {
        width: '100%',
        height: 300,
    },
    /** Content */
    content: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 24,
    },
    contentHeader: {
        paddingHorizontal: 24,
    },
    appName: {
        backgroundColor: '#fff2dd',
        transform: [
            {
                rotate: '-5deg',
            },
        ],
        paddingHorizontal: 6,
    },
    appNameText: {
        fontSize: 28,
        fontWeight: '700',
        color: '#281b52',
    },
    /** Button */
    button: {
        backgroundColor: '#2074df',
        paddingVertical: 12,
        paddingHorizontal: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
    },
    buttonText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#fff',
    },

});