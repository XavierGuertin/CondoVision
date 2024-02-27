import React, {useEffect, useState} from 'react';
import {OwnerMapComponent} from "@ui/OwnerMapComponent";
import {auth, db} from '../../web/firebase.js';
import {useAuthState} from "react-firebase-hooks/auth";
import {
    View,
    SafeAreaView,
    StyleSheet,
    Text,
} from 'react-native';
import {collection, getDocs} from "firebase/firestore";


export default function OwnerMapScreen() {

    const [ownderData, setOwnerData] = useState([]);
    const [user] = useAuthState(auth);
    const userDocRef = getDoc(collection(db, "users", ))

    useEffect(() => {
        const propertiesRef = collection(db, "properties");
        let unitList = [];
        getDocs(propertiesRef).then((propertiesQuerySnapshot) => {
            propertiesQuerySnapshot.forEach(propertyDoc => {
                let condoUnitRef = propertyDoc.ref.collection("CondoUnits");

                getDocs(condoUnitRef.where('owner', '==', user)).then((condoUnitSnapshot => {

                }))
            })
        })
    }, []);

    return(
    <View style={styles.container}>
        <OwnerMapComponent />
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        fontSize: 25,
        fontWeight: '500',
    },
});

export default OwnerMapScreen;