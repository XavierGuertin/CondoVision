import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
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

const BoldLabelWithValue = ({ label, value }) => (
    <View style={styles.row}>
    <Text style={styles.boldLabel}>{label}</Text>
    <Text>{value}</Text>
    </View>
);

const FeeCalculationRow = ({ label, isExpanded, toggle, details }) => (
    <View style={styles.itemContainer}>
        <TouchableOpacity style={styles.itemHeader} onPress={toggle}>
        <Text style={styles.itemHeaderText}>{label}</Text>
        <View style={styles.itemHeaderValueContainer}>
            <Text style={styles.itemHeaderValue}>{(details.value1 * details.value2)}</Text>
            <Text style={styles.chevron}>{isExpanded ? '▲' : '▼'}</Text>
        </View>
        </TouchableOpacity>
        {isExpanded && (
        <View style={styles.itemDetails}>
            <BoldLabelWithValue label={details.label1} value={details.value1} />
            <BoldLabelWithValue label={details.label2} value={details.value2} />
        </View>
        )}
    </View>
);
  
const CondoFeeCalculationScreen = () => {
    const [loading, setLoading] = useState(true);
    const [isUnitFeeExpanded, setUnitFeeExpanded] = useState(false);
    const [isParkingFeeExpanded, setParkingFeeExpanded] = useState(false);
    const [condoDimensions, setCondoDimensions] = useState(0);
    const [feePerFt, setFeePerFt] = useState(0);
    const [parkingSpotCount, setParkingSpotCount] = useState(0);
    const [parkingFee, setParkingFee] = useState(0);

    const navigation = useNavigation();

    useEffect(() => {
        const fetchData = async () => {
            const condoId = await AsyncStorage.getItem("unitId");
            const propertyId = await AsyncStorage.getItem("propertyId");

            //fetch unit data
            const condoSnapshot = await getDoc(
                doc(db, "properties", propertyId, "condoUnits", condoId)
            );
            const unitData = condoSnapshot.data();

            // Fetch condo dimension (size) from database
            const snapshotCondoDimensionsString: string = unitData.size;
            const snapshotCondoDimensions: number = parseInt(snapshotCondoDimensionsString);
            setCondoDimensions(snapshotCondoDimensions);

            // Fetch condo fee per ft² (mothly fee) from database
            const snapshotFeePerFtString: string = unitData.condoFees.monthlyFee;
            const snapshotFeePerFt: number = parseInt(snapshotFeePerFtString);
            setFeePerFt(snapshotFeePerFt);

            // Fetch parking spot/unit from firebase
            const snapshotParkingSpotId: string = unitData.parkingSpotId;
            //if parking spot is not null or undefined, parkingspotcount is 1, else 0
            setParkingSpotCount(snapshotParkingSpotId === null || snapshotParkingSpotId === undefined || snapshotParkingSpotId === "" ? 0 : 1);
            

            // TODO: fetch parking fee from newly created parkingFee field
            const parkingFee = 4;
            setParkingFee(parkingFee);
        };
        fetchData();
        setTimeout(() => {
            setLoading(false);
          }, 1000);
    }, []);

    return (
        <View style={styles.mainContainer}>
            <View style={styles.backButton}>
                <Button 
                    title="Back"
                    onPress={() => navigation.navigate("CondoUnitDescriptionScreen")}
                />
            </View>
            { loading ? (
                <View style ={styles.loading}>
                    <ActivityIndicator size={"large"} />
                </View>
            ) : (
                <ScrollView 
                    style={styles.scrollViewStyle}
                    contentContainerStyle={{ alignItems: "center", justifyContent: 'flex-start'}}
                    >
                    <Text style={styles.header}>Fee Calculation</Text>
                    <View style={styles.section}>
                        <FeeCalculationRow
                            label="Total Unit Fee ($) = "
                            isExpanded={isUnitFeeExpanded}
                            toggle={() => setUnitFeeExpanded(!isUnitFeeExpanded)}
                            details={{ label1: "Condo Dimensions (ft²) = ", value1: condoDimensions , label2: "Fee per ($/ft²) = ", value2: feePerFt }}
                        />
                    </View>
                    <View style={styles.section}>
                        <FeeCalculationRow 
                            label="Parking Spot(s) Fees = "
                            isExpanded={isParkingFeeExpanded}
                            toggle={() => setParkingFeeExpanded(!isParkingFeeExpanded)}
                            details={{ label1: "Parking Spot(s) = ", value1: parkingSpotCount, label2: "Fee per Parking Spot = ", value2: parkingFee }}
                        />
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.grandTotalText}>TOTAL FEES = 64$</Text>
                    </View>
                </ScrollView>
                )}
      </View>
    );
  };


  
  const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
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
        fontWeight: 'bold',
        marginVertical: 20,
    },
    section: {
        flexDirection: "column",
        backgroundColor: 'white',
        width: "90%",
        borderRadius: 8,
        padding: 20,
        marginVertical: 10,
        justifyContent: "center",
    },
    totalText: {
        marginTop: 10,
        backgroundColor: 'lightblue',
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 8,
        overflow: 'hidden',
        fontWeight: 'bold',
        // textAlign: 'center',
        alignSelf: 'stretch',
    },
    grandTotalText: {
        marginTop: 10,
        backgroundColor: 'lightgreen',
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 8,
        overflow: 'hidden',
        fontWeight: 'bold',
        fontSize: 16,
    },
    rowWithSymbol: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        alignItems: 'center', // align items vertically
    },
    multiplySymbol: {
        fontWeight: 'bold',
        fontSize: 18, // size your multiplication symbol
        marginRight: 4, // add some spacing after the multiplication symbol
    },
    itemContainer: {
        backgroundColor: 'white',
        marginBottom: 10,
        borderRadius: 6,
        overflow: 'hidden', // This keeps the child views within the rounded border
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0', // Color for the bottom border
    },
    itemHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    itemHeaderValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemHeaderValue: {
        fontSize: 16,
        color: '#333',
    },
    chevron: {
        marginLeft: 10,
        fontSize: 16,
    },
    itemDetails: {
        padding: 20,
        backgroundColor: '#F5F5F5', // Lighter background for the details section
    },
    // Adjust the row style for details
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5, // Less padding for the detail items
    },
    boldLabel: {
        fontWeight: 'bold',
        color: '#333',
    },
    value: {
        color: '#333',
    },
    backButton: {
        alignSelf: "flex-start",
        paddingLeft: 20,
        marginBottom: 20,
    },
});


export default CondoFeeCalculationScreen;