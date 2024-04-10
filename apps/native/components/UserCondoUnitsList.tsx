// UserCondoUnitsList.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@native/firebase'; // Adjust this path as necessary
import { getAuth } from 'firebase/auth';

const UserCondoUnitsList = () => {
  const [condoUnits, setCondoUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnits = async () => {
      setLoading(true);
      const auth = getAuth();
      const currentUser = auth.currentUser;
      const userEmail = currentUser ? currentUser.email : null;

      if (!userEmail) {
        console.log('No user email found');
        setLoading(false);
        return;
      }

      try {
        const registrationKeysRef = collection(db, "RegistrationKeys");
        const q = query(registrationKeysRef, where("email", "==", userEmail), where("isUsed", "==", true));
        const querySnapshot = await getDocs(q);
        let units = [];

        for (const docSnapshot of querySnapshot.docs) {
          const { condoUnitID, propertyID, ...registrationKeyData } = docSnapshot.data();
          if (condoUnitID && propertyID) {
            const condoUnitRef = doc(db, `properties/${propertyID}/condoUnits/${condoUnitID}`);
            const condoUnitSnapshot = await getDoc(condoUnitRef);
            if (condoUnitSnapshot.exists()) {
              units.push({
                id: condoUnitID,
                ...condoUnitSnapshot.data(),
                registrationKey:  { ...registrationKeyData, id: docSnapshot.id },
              });
            }
          }
        }

        setCondoUnits(units);
      } catch (error) {
        console.error("Error fetching condo units: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, []);

  if (loading) {
    return <Text>Loading your condo units...</Text>;
  }

  return (
    <FlatList
      data={condoUnits}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.unitContainer}>
            <Text style={styles.unitText}>Condo Unit ID: {item.id}</Text>
            <Text style={styles.unitText}>Status: {item.registrationKey.status}</Text>
            <Text style={styles.unitText}>Unit Number: {item.unitId}</Text>
            <Text style={styles.unitText}>Size: {item.size} sqft</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  unitContainer: {
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 20
  },
  unitText: {
    fontSize: 16,
    marginBottom: 4,
  },
});

export default UserCondoUnitsList;