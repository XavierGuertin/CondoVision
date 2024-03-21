import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "firebase/firestore";
import { db } from "web/firebase";

/**
 * Screen to display the description of a condo unit.
 */
export default function CondoUnitDescriptionScreen() {
  const [unit, setUnit] = useState(Object); // Initialize unit state as an empty object
  const [unitId, setUnitId] = useState(String); // Initialize unitId state as an empty string
  const [loading, setLoading] = useState(true); // State to track loading status

  const navigation = useNavigation(); // Hook to access navigation

  useEffect(() => {
    const fetchId = async () => {
      await AsyncStorage.multiGet(["propertyId", "unitId"]).then((list) => {
        const pid = list.at(0)?.at(1);
        const unid = list.at(1)?.at(1);
        setUnitId(unid);
        console.log(pid, " ", unid);
        getDoc(doc(db, `properties/${pid}/condoUnits/${unid}`)).then((snap) => {
          console.log(snap.data());
          setUnit(snap.data()); // Set unit data
        });
      });
      setTimeout(() => {
        setLoading(false); // Set loading to false once data is fetched
      }, 2000);
    };
    fetchId(); // Call fetchId when component mounts
  }, []);

  // Function to compile and return included amenities from condo fees
  const includesText = () => {
    let includesString: string = "";
    unit.condoFees.includes.map(
      (included: string) => (includesString += included + ", ")
    );
    return includesString.slice(0, includesString.length - 2); //Removing teh ", " at the end of the final string
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {!loading ? (
          <>
            <View style={styles.backButtonContainer}>
              <Button
                title="Back"
                onPress={() => navigation.navigate("PropertyManagement")}
              ></Button>
            </View>
            <View style={styles.unitDescriptionContainer}>
              <View style={styles.imageContainer}>
                <Image
                  style={styles.image}
                  source={require("../../../public/logo.png")}
                ></Image>
              </View>
              <View style={styles.unitDescription}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>{unitId}</Text>
                </View>
                <Text style={styles.subtitle}>
                  Included in Condo Fees: {includesText()}
                </Text>
                <Text style={styles.subtitle}>
                  Monthly Fee: {unit.condoFees.monthlyFee}
                </Text>
                <Text style={styles.subtitle}>Locker Id: {unit.lockerId}</Text>
                <Text style={styles.subtitle}>
                  Occupant Name: {unit.occupantInfo.name}
                </Text>
                <Text style={styles.subtitle}>
                  Occupant Contact: {unit.occupantInfo.contact}
                </Text>
                <Text style={styles.subtitle}>
                  Parking Spot Id: {unit.parkingSpotId}
                </Text>
                <Text style={styles.subtitle}>Size: {unit.size}</Text>
                <Text style={styles.subtitle}>Unit Id: {unit.unitId}</Text>
                <Button
                  title="Fees"
                  onPress={() =>
                    navigation.navigate("CondoPaymentFeeStatusAndHistoryScreen")
                  }
                />
                <Button
                  title="See Calculated Fees"
                  onPress={() =>
                    navigation.navigate("CondoFeeCalculationScreen")
                  }
                />
              </View>
            </View>
          </>
        ) : (
          <Text style={styles.subtitle}>Loading... </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  header: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  subtitle: { fontSize: 16, fontWeight: "bold", marginBottom: 12 },
  title: { fontSize: 25, fontWeight: "bold", marginBottom: 20 },
  unitDescriptionContainer: {
    width: "100%",
  },
  backButtonContainer: {
    marginBottom: 20,
  },
  unitDescription: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 20,
  },
  imageContainer: {
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 200,
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 20,
  },
  titleContainer: {
    alignItems: "center",
  },
});
