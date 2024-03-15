import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "firebase/firestore";
import { db } from "web/firebase";

export default function CondoUnitDescriptionScreen({ navigation }) {
  const [unit, setUnit] = useState(Object);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchId = async () => {
      await AsyncStorage.multiGet(["propertyId", "unitId"]).then((list) => {
        const pid = list.at(0)?.at(1);
        const unid = list.at(1)?.at(1);
        console.log(pid, " ", unid);
        getDoc(doc(db, `properties/${pid}/condoUnits/${unid}`)).then((snap) => {
          console.log(snap.data());
          setUnit(snap.data());
        });
      });
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    };
    fetchId();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {!loading ? (
          <>
            <Text style={styles.title}>CondoFees: </Text>
            <View style={styles.header}>
              <Text style={styles.title}>
                Includes: {unit.condoFees.includes}
              </Text>
              <Text style={styles.title}>
                Monthly Fee: {unit.condoFees.monthlyFee}
              </Text>
            </View>
            <Text style={styles.title}>Locker ID: {unit.lockerId}</Text>
            <Text style={styles.title}>Occupant Info: </Text>
            <View style={styles.header}>
              <Text style={styles.title}>
                Contact: {unit.occupantInfo.contact}
              </Text>
              <Text style={styles.title}>Name: {unit.occupantInfo.name}</Text>
            </View>
            <Text style={styles.title}>Owner: {unit.owner}</Text>
            <Text style={styles.title}>
              Parking Spot ID: {unit.parkingSpotId}
            </Text>
            <Text style={styles.title}>Size: {unit.size}</Text>
            <Text style={styles.title}>Unit ID: {unit.unitId}</Text>
          </>
        ) : (
          <Text style={styles.title}>Loading... </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  header: {
    flexDirection: "col",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", marginLeft: 20 },
});
