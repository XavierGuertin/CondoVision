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

const FeeCalculationRow = ({ label, value, isExpanded, toggle, details }) => (
    <View style={styles.itemContainer}>
        <TouchableOpacity style={styles.itemHeader} onPress={toggle}>
        <Text style={styles.itemHeaderText}>{label}</Text>
        <View style={styles.itemHeaderValueContainer}>
            <Text style={styles.itemHeaderValue}>{value}</Text>
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

    const navigation = useNavigation();

    useEffect(() => {
        const fetchData = async () => {
          // TODO: fetch data from firebase
        };
        fetchData();
        setTimeout(() => {
            setLoading(false);
          }, 1000);
      }, []);

    return loading ? (
        <View style ={styles.loading}>
            <ActivityIndicator size={"large"} />
        </View>
    ) : (
      <ScrollView 
        style={styles.container}
        contentContainerStyle={{justifyContent: 'flex-start'}}
        >
        <Text style={styles.header}>Fee Calculation</Text>
        <View style={styles.section}>
          <FeeCalculationRow
            label="Total Unit Fee ($) = "
            value="9 $"
            isExpanded={isUnitFeeExpanded}
            toggle={() => setUnitFeeExpanded(!isUnitFeeExpanded)}
            details={{ label1: "Condo Dimensions (ft²) = ", value1: "3", label2: "Fee per ($/ft²) = ", value2: "3" }}
          />
        </View>
        <View style={styles.section}>
            <FeeCalculationRow 
                label="Parking Spot(s) Fees = " 
                value="1 $"
                isExpanded={isParkingFeeExpanded}
                toggle={() => setParkingFeeExpanded(!isParkingFeeExpanded)}
                details={{ label1: "Parking Spot(s) = ", value1: "3", label2: "Fee per Parking Spot = ", value2: "3" }}
            />
        </View>
        <View style={styles.section}>
          {/* <Text style={styles.grandTotalText}>TOTAL FEES = {grandTotal}</Text> */}
          <Text style={styles.grandTotalText}>TOTAL FEES = 64$</Text>
        </View>
      </ScrollView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: '5%',
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
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        marginVertical: 10,
        alignSelf: 'stretch',
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
});


export default CondoFeeCalculationScreen;