import React, {useEffect, useState} from 'react';
import {MapComponent} from "@ui/MapComponent";
import {db} from '../../web/firebase.js';
import {
    View,
    SafeAreaView,
    StyleSheet,
    Text,
    ActivityIndicator,
} from 'react-native';
import {collection, getDocs, query} from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from "firebase/compat";
import firestore = firebase.firestore;
import { Firestore } from 'firebase/firestore';

export function OwnerMapScreen() {

    const [state, setState] = useState("");
    const [ownedUnits, setOwnedUnits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const userID = async () => {
        try {
            const value = await AsyncStorage.getItem("userUID");
            if (value !== null) {
                return value;
            }
        } catch (error) {}
    };

    const coordinates = [
        {
            latitude: 45.49680028420473,
            longitude: -73.56879175215543,
        },
        {
            latitude: 45.48038685337935,
            longitude: -73.57726341610069,
        }
    ]

    useEffect(() => {
        const fetchData = async () => {
            const unitList = [];
            try {
                const propertiesCollectionRef = collection(db, 'properties');
                const q = query(propertiesCollectionRef);
                const propertiesCollectionSnapshot = await getDocs(q);

                propertiesCollectionSnapshot.forEach(async propertyDoc => {
                    const condoUnitsCollectionRef = collection(db, 'properties', propertyDoc.id, 'CondoUnits');
                    const condoUnitsSnapshot = await getDocs(condoUnitsCollectionRef);
                    var stopper = true
                    var propertyData = propertyDoc.data();
                    condoUnitsSnapshot.forEach(condoUnitDoc => {
                        var condoData = condoUnitDoc.data();
                        if (condoData.owner == "QSgWxLSwWVX1G40bzvSo7V0WtvP2" && stopper) {
                            unitList.push({
                                userId: "QSgWxLSwWVX1G40bzvSo7V0WtvP2",
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

        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" /> // Show loading indicator while loading
            ) : (
                <MapComponent data={ownedUnits} /> // Render map when not loading
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    text: {
        fontSize: 25,
        fontWeight: '500',
    },
});

export default OwnerMapScreen;