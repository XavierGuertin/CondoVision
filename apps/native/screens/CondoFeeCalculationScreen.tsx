import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Text,
  ScrollView,
  View,
  StyleSheet,
  Button,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { db } from "web/firebase";

// Displays a label with a value. And If `isMoney` is true, appends a dollar sign.
const BoldLabelWithValue = ({ label, value, isMoney }) => (
  <View style={styles.row}>
    <Text style={styles.boldLabel}>{label}</Text>
    <Text style={isMoney ? styles.value : null}>
      {value} {isMoney && "$"}
    </Text>
  </View>
);

// Displays a Fee row with an expandable section to show details of calculation of it.
const FeeCalculationRow = ({ label, isExpanded, toggle, details }) => (
  <View style={styles.itemContainer}>
    <TouchableOpacity style={styles.itemHeader} onPress={toggle}>
      <Text style={styles.itemHeaderText}>{label}</Text>
      <View style={styles.itemHeaderValueContainer}>
        <Text style={styles.itemHeaderValue}>
          {details.value1 * details.value2} $
        </Text>
        <Text style={styles.chevron}>{isExpanded ? "▲" : "▼"}</Text>
      </View>
    </TouchableOpacity>
    {isExpanded && (
      <View style={styles.itemDetails}>
        <BoldLabelWithValue
          label={details.label1}
          value={details.value1}
          isMoney={false}
        />
        <Text style={styles.multiplySymbol}>x</Text>
        <BoldLabelWithValue
          label={details.label2}
          value={details.value2}
          isMoney={true}
        />
      </View>
    )}
  </View>
);

// Main component for calculating and displaying condo fees.
const CondoFeeCalculationScreen = () => {
  const [loading, setLoading] = useState(true);
  const [isUnitFeeExpanded, setUnitFeeExpanded] = useState(false);
  const [isParkingFeeExpanded, setParkingFeeExpanded] = useState(false);
  const [condoDimensions, setCondoDimensions] = useState(0);
  const [feePerFt, setFeePerFt] = useState(0);
  const [parkingSpotCount, setParkingSpotCount] = useState(0);
  const [parkingFeePerSpot, setParkingFee] = useState(0);
  const [totalCondoFees, setTotalCondoFees] = useState(0);
  const [totalParkingFees, setTotalParkingFees] = useState(0);
  const [totalFees, setTotalFees] = useState(0);

  const navigation = useNavigation();

  // Fetches and sets initial data for condo fee calculations.
  useEffect(() => {
    const fetchData = async () => {
      const condoId = await AsyncStorage.getItem("unitId");
      const propertyId = await AsyncStorage.getItem("propertyId");

      if (condoId && propertyId) {
        //fetch unit data
        const condoSnapshot = await getDoc(
          doc(db, "properties", propertyId, "condoUnits", condoId)
        );

        if (condoSnapshot.exists()) {
          const unitData = condoSnapshot.data();

          setCondoDimensions(Number(unitData.size) || 0);
          setFeePerFt(Number(unitData.condoFees.monthlyFee) || 0);
          // If parking spot is not null or undefined, parkingspotcount is 1, else 0
          setParkingSpotCount(unitData.parkingSpotId ? 1 : 0);
          // For now, we just set the parking fee to a fixed value for demonstration.
          // TODO: fetch parking fee from newly created parkingFee field
          setParkingFee(4);
        }
      }
    };

    fetchData();
  }, []);

  // Calculation of totalCondoFees and totalParkingFees when dependencies change
  useEffect(() => {
    setTotalCondoFees(condoDimensions * feePerFt);
    setTotalParkingFees(parkingSpotCount * parkingFeePerSpot);
  }, [condoDimensions, feePerFt, parkingSpotCount, parkingFeePerSpot]);

  // Calculation of totalFees
  useEffect(() => {
    setTotalFees(totalCondoFees + totalParkingFees);

    // Now that all calculations are done, set loading to false afteer a delay
    // Loading state remains for at least 1 second for better UX
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [totalCondoFees, totalCondoFees]);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.backButton}>
        <Button
          testID="feeCalculationBackButton"
          title="Back"
          onPress={() => navigation.navigate("CondoUnitDescriptionScreen")}
        />
      </View>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size={"large"} />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollViewStyle}
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Text id="feeHeader" style={styles.header}>Monthly Fee Calculation</Text>
          <View id="condoFeeSection" style={styles.section}>
            <FeeCalculationRow
              label="Total Unit Fee= "
              isExpanded={isUnitFeeExpanded}
              toggle={() => setUnitFeeExpanded(!isUnitFeeExpanded)}
              details={{
                label1: "Condo Dimensions (ft²) = ",
                value1: condoDimensions,
                label2: "Fee per sq.ft ($/ft²) = ",
                value2: feePerFt,
              }}
            />
          </View>
          <View id="parkingFeeSection" style={styles.section}>
            <FeeCalculationRow
              label="Parking Spot(s) Fees = "
              isExpanded={isParkingFeeExpanded}
              toggle={() => setParkingFeeExpanded(!isParkingFeeExpanded)}
              details={{
                label1: "Parking Spot(s) = ",
                value1: parkingSpotCount,
                label2: "Fee per Parking Spot ($/spot) = ",
                value2: parkingFeePerSpot,
              }}
            />
          </View>
          {/* TODO: seperate total fees and result */}
          <View style={styles.section}>
            <Text style={styles.grandTotalText}>
              TOTAL FEES = {totalFees} $
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    flexDirection: "column",
    paddingBottom: "20%",
    paddingTop: "20%",
    width: "100%",
    height: "100%",
  },
  scrollViewStyle: {
    width: "100%",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 20,
  },
  section: {
    flexDirection: "column",
    backgroundColor: "white",
    width: "90%",
    borderRadius: 8,
    padding: 20,
    marginVertical: 10,
    justifyContent: "center",
  },
  totalText: {
    marginTop: 10,
    backgroundColor: "lightblue",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 8,
    overflow: "hidden",
    fontWeight: "bold",
    alignSelf: "stretch",
  },
  grandTotalText: {
    marginTop: 10,
    backgroundColor: "lightgreen",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 8,
    overflow: "hidden",
    fontWeight: "bold",
    fontSize: 16,
  },
  rowWithSymbol: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    alignItems: "center",
  },
  itemContainer: {
    backgroundColor: "white",
    marginBottom: 10,
    borderRadius: 6,
    overflow: "hidden",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  itemHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  itemHeaderValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemHeaderValue: {
    fontSize: 16,
    color: "#333",
  },
  chevron: {
    marginLeft: 10,
    fontSize: 16,
  },
  itemDetails: {
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  multiplySymbol: {
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  boldLabel: {
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    color: "#333",
  },
  backButton: {
    alignSelf: "flex-start",
    paddingLeft: 20,
    marginBottom: 20,
  },
});

export default CondoFeeCalculationScreen;
