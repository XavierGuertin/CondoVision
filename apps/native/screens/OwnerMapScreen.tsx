import React, {useEffect, useState} from 'react';
import {MapComponent} from "@ui/MapComponent";
import {db} from '../../web/firebase.js';
import {View, StyleSheet, ActivityIndicator, TouchableOpacity, Text} from 'react-native';
import {collection, getDocs, query} from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export function OwnerMapScreen({ navigation }: any) {

    const [uID, setUserId] = useState("")
    const [ownedUnits, setOwnedUnits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserId = async () => {
            // You'll see that userId is logged in console (just not in time for fetchData function)
            await AsyncStorage.getItem('userUID')
                .then((value) => {
                    const data = JSON.parse(value);
                    console.log('JSON data: ' + data)
                    setUserId(data);
                });
        }

        const fetchData = async () => {
            const unitList = [];
            try {
                const propertiesCollectionRef = collection(db, 'properties');
                const q = query(propertiesCollectionRef);
                const propertiesCollectionSnapshot = await getDocs(q);

                // (HERE) Have to implement way to fetch userId from AsyncStorage
                // Currently set my id (louis) for functionality
                const userId = "QSgWxLSwWVX1G40bzvSo7V0WtvP2";

                // Get condo unit documents nested in properties
                propertiesCollectionSnapshot.forEach(async propertyDoc => {
                    const condoUnitsCollectionRef = await collection(db, 'properties', propertyDoc.id, 'CondoUnits');
                    const condoUnitsSnapshot = await getDocs(condoUnitsCollectionRef);
                    var stopper = true
                    var propertyData = await propertyDoc.data();
                    await condoUnitsSnapshot.forEach( condoUnitDoc => {
                        var condoData =  condoUnitDoc.data();
                        if (condoData.owner == userId && stopper) {
                             unitList.push({
                                userId: userId,
                                propertyId: propertyDoc.id,
                                coordinates: {
                                    latitude: propertyData.latitude,
                                    longitude: propertyData.longitude,
                                }
                            });
                            setOwnedUnits(unitList);
                            stopper = false;
                        }
                    });
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                }, 200);
            }
        };

        fetchUserId();
        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            {/* Send user back to wherever they came from */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
                    <FontAwesome5 name="times" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Units Owned Locations</Text>
            </View>
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" /> // Show loading indicator while loading
            ) : (
                <View style={styles.mapContainer}>
                    <MapComponent data={ownedUnits} />
                </View>
            )}
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
    },
});

export default OwnerMapScreen;