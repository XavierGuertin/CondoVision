import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AddCondoPropertyForm from '../components/AddCondoProfileProperty';
import AddCondoUnitForm from '../components/AddCondoUnitInformation';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const AddCondoProfileScreen = ({ navigation }: any) => {
    const [propertyId, setPropertyId] = useState('');
    const [unitCount, setUnitCount] = useState(0);
    const [currentUnit, setCurrentUnit] = useState(0); // Start with 0 to not display AddCondoUnitForm initially

    const handlePropertySaved = async (propertyName: unknown, address: unknown) => {
        const propertiesRef = collection(db, 'properties');
        const q = query(propertiesRef, where("propertyName", "==", propertyName), where("address", "==", address));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            setPropertyId(doc.id);
            setUnitCount(doc.data().unitCount);
            setCurrentUnit(1); // Start adding units after property is saved
        });
    };

    const handleUnitSaved = () => {
        if (currentUnit < unitCount) {
            setCurrentUnit(currentUnit + 1); // Prepare for next unit
        } else {
            alert('All units for this property have been added!');
            navigation.navigate('PropertyManagement');
            // Optionally, navigate away or reset form to allow adding another property
            setCurrentUnit(0); // Reset or manage navigation
            setPropertyId(''); // Reset property ID if needed
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Add New Property</Text>
            </View>
            <ScrollView style={styles.flexibleContainer}>
                {propertyId === '' ? (
                    <AddCondoPropertyForm onPropertySaved={handlePropertySaved} />
                ) : currentUnit > 0 && currentUnit <= unitCount ? (
                    <AddCondoUnitForm propertyId={propertyId} onUnitSaved={handleUnitSaved} />
                ) : null}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    flexibleContainer: {
        flex: 1,
        width: '100%',
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
    },
});

export default AddCondoProfileScreen;
