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
import { Button } from '@ui/button';
import { useNavigation } from "@react-navigation/native";
// @ts-ignore
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import CondoProfileComponent from "../components/CondoProfileComponent";
import { db } from "../../web/firebase";
import { getDocs, collection, query } from "firebase/firestore";
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
        const propertiesCollectionSnapshot = await getDocs(
          collection(db, "properties")
        );

        propertiesCollectionSnapshot.forEach(async (propertyDoc) => {
          const unitList: Object[] = [];
          const condoUnitsSnapshot = await getDocs(
            collection(db, "properties", propertyDoc.id, "condoUnits")
          );
          const userUID = await AsyncStorage.getItem("userUID");
          var stopper = true;
          var propertyData = propertyDoc.data();

          condoUnitsSnapshot.forEach((condoUnitDoc) => {
            var condoData = condoUnitDoc.data();

            if (condoData.owner === userUID && stopper) {
              const condoUnit = new CondoUnitAdapter(
                condoData.id,
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
              stopper = false;
            }
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
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerIcon}
        >
          <FontAwesome5 name="times" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Condo Profiles</Text>
      </View>
      <ScrollView style={styles.flexibleContainer}>
        {ownedProperties.map((property) => (
          <CondoProfileComponent data={property} key={property.id} />
        ))}
      </ScrollView>
            <View style = {styles.footer}>
            <Button
              text="Add New Property"
              onClick={() => navigation.navigate('AddCondoProfileScreen')}
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
  footer:{
    margin: 30
  },
});

export default CondoProfileScreen;
