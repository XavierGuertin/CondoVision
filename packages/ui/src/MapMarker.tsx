import React from 'react';
import {Marker} from "react-native-maps";

export const MapMarker = () => {

    const montrealCoord = {
        latitude: 45.50148637849399,
        longitude: -73.56833166744768,
        latitudeDelta: 0.3,
        longitudeDelta: 0.4,
    }

    return (
        <Marker coordinate={montrealCoord} />
    );
}