import React, {useEffect, useState} from 'react';
import MapView, {PROVIDER_GOOGLE, Marker} from "react-native-maps";
import MapViewDirections from 'react-native-maps-directions';
import { View, StyleSheet} from "react-native";
import { auth, db } from '@web/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import {getDocs, collection} from "firebase/firestore";

export const OwnerMapComponent = () => {

    const [ownderData, setOwnerData] = useState([]);
    const [user] = useAuthState(auth);

    useEffect(() => {
        const propertiesRef = collection(db, "properties");
        let unitList = [];
        getDocs(collection(db, "properties")).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {

            })
        })
    }, []);

    const montrealCoord = {
        latitude: 45.50148637849399,
        longitude: -73.56833166744768,
        latitudeDelta: 0.3,
        longitudeDelta: 0.4,
    }
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

    return(
        <MapView initialRegion={montrealCoord} style={StyleSheet.absoluteFill} provider={PROVIDER_GOOGLE}>
            <MapViewDirections
                origin={coordinates[0]}
                destination={coordinates[1]}
                apikey={"AIzaSyDZRX6S8WB4-_UEIk3eUvPqljZH-N7paRw"}
                mapId={"34f95bdf29f35ca3"}
                strokeColor="red"
                strokeWidth={4}
            />
            <Marker coordinate={montrealCoord} />
        </MapView>
    );

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        text: {
            fontSize: 25,
            fontWeight: '500',
        },
    });
}