import React, {useEffect, useState} from 'react';
import {MapComponent} from "../components/MapComponent";
import {db} from '../../web/firebase.js';
import {View, StyleSheet, ActivityIndicator, TouchableOpacity, Text} from 'react-native';
import {collection, getDocs, query} from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export function MapScreen({ navigation, route }) {

    const [ownedUnits, setOwnedUnits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // const fetchData = async () => {
        //     const unitList = [];
        //     try {
        //         const propertiesCollectionRef = collection(db, 'properties');
        //         const q = await query(propertiesCollectionRef);
        //         const propertiesCollectionSnapshot = await getDocs(q);
        //
        //         const userUID = await AsyncStorage.getItem("userUID");
        //
        //         // Get condo unit documents nested in properties
        //         await propertiesCollectionSnapshot.forEach(async propertyDoc => {
        //             const condoUnitsCollectionRef = await collection(db, 'properties', propertyDoc.id, 'condoUnits');
        //             const condoUnitsSnapshot = await getDocs(condoUnitsCollectionRef);
        //             var stopper = true
        //             var propertyData = await propertyDoc.data();
        //             await condoUnitsSnapshot.forEach( condoUnitDoc => {
        //                 var condoData =  condoUnitDoc.data();
        //                 if (condoData.owner == userUID && stopper) {
        //                     unitList.push({
        //                         userId: userUID,
        //                         propertyId: propertyDoc.id,
        //                         coordinates: {
        //                             latitude: propertyData.latitude,
        //                             longitude: propertyData.longitude,
        //                         }
        //                     });
        //                     stopper = false;
        //                 }
        //             });
        //         });
        //         setOwnedUnits(unitList);
        //     } catch (error) {
        //         console.error('Error fetching data:', error);
        //
        //     } finally {
        //         setTimeout(() => {
        //             setIsLoading(false);
        //         }, 400);
        //     }
        // };
        //
        // fetchData();
        // const properties = route.params
        setOwnedUnits(route.params.properties);
        //console.log(route.params.properties[0].latitude);
        //console.log(route.params.type);
        // const property = route.params[0];
        // console.log(property.propertyName);
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
            {/*{isLoading ? (*/}
            {/*    <ActivityIndicator size="large" color="#0000ff" /> // Show loading indicator while loading*/}
            {/*) : (*/}
                <View style={styles.mapContainer}>
                    <MapComponent data={ownedUnits} />
                </View>
            {/*)}*/}
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