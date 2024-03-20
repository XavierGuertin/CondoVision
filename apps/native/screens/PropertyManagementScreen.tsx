import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Button } from "@native/components/button";
import { useNavigation } from "@react-navigation/native";
import PropertyProfileComponent from "../components/PropertyProfileComponent";
import { db } from "../firebase";
import { getDocs, collection, query, where } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PropertyAdapter from "@native/components/PropertyAdapter";
import CondoUnitAdapter from "@native/components/CondoUnitAdapter";

const CondoProfileScreen = () => {
  const navigation = useNavigation();

  const [ownedProperties, setOwnedProperties] = useState<Object[]>([]);
  const [isLoading, setIsLoading] = useState<Boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const propertyList: Object[] = [];
      try {
        const userUID = await AsyncStorage.getItem("userUID");
        const propertiesCollectionSnapshot = await getDocs(
          query(collection(db, "properties"), where("owner", "==", userUID))
        );

        propertiesCollectionSnapshot.forEach(async (propertyDoc) => {
          const unitList: Object[] = [];
          const condoUnitsSnapshot = await getDocs(
            collection(db, "properties", propertyDoc.id, "condoUnits")
          );

          const propertyData = propertyDoc.data();

          condoUnitsSnapshot.forEach((condoUnitDoc) => {
            const condoData = condoUnitDoc.data();
            const condoId = condoUnitDoc.id;

            const condoUnit = new CondoUnitAdapter(
              condoId,
              {
                includes: condoData.condoFees.includes,
                monthlyFee: condoData.condoFees.monthlyFee,
              },
              condoData.lockerId,
              {
                contact: condoData.occupantInfo.contact,
                name: condoData.occupantInfo.name,
              },
              condoData.owner,
              condoData.parkingSpotId,
              condoData.size,
              condoData.unitId
            );
            unitList.push(condoUnit.toJSON());
          });
          if (propertyData.owner === userUID) {
            const property = new PropertyAdapter(
              propertyDoc.id,
              propertyData.address,
              propertyData.lockerCount,
              propertyData.owner,
              propertyData.parkingCount,
              propertyData.propertyName,
              propertyData.unitCount,
              unitList
            );
            propertyList.push(property.toJSON());
            console.log("Loaded property:");
            console.log(property.toJSON());
            setOwnedProperties(propertyList);
          }
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };

    fetchData();
  }, []);

  if (isLoading)
    return <ActivityIndicator style={styles.loading} size="large" />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Condo Profiles</Text>
      </View>
      <ScrollView id="propertyView" style={styles.flexibleContainer}>
        {ownedProperties.length > 0 ? (
          ownedProperties.map((property) => (
            <PropertyProfileComponent data={property} key={property.id} />
          ))
        ) : (
          <Text style={styles.noCondosText}>No Condos were found.</Text>
        )}
      </ScrollView>
      <View id="addPropertyBtnView" style={styles.addPropertyBtn}>
        <Button
          text="Register a New Property"
          onClick={() => navigation.navigate("AddCondoProfileScreen")}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  flexibleContainer: {
    flex: 1,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  headerIcon: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 20, // Added margin to space out the title from the icon
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noCondosText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
  },
  addPropertyBtn: {
    margin: 30,
    marginBottom: 100,
  },
});

export default CondoProfileScreen;
