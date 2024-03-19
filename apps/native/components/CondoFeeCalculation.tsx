import { getStorage, ref, uploadBytes, uploadString, getDownloadURL } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Button, TextInput, TouchableOpacity } from 'react-native';
import { collection, addDoc } from "firebase/firestore";

const BoldLabelWithValue = ({ label, value }) => {
    return (
      <View style={styles.row}>
        <Text style={styles.boldLabel}>{label}</Text>
        <Text>{value}</Text>
      </View>
    );
};

const FeeCalculationRow = ({ label, value, isExpanded, toggle, details }) => {
    return (
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
};
  
const CondoFeeCalculation = () => {
    const [isUnitFeeExpanded, setUnitFeeExpanded] = useState(false);
    const [isParkingFeeExpanded, setParkingFeeExpanded] = useState(false);
    // const [condoSize, setCondoSize] = useState('');
    // const [parkingSpots, setParkingSpots] = useState('');
    // const [feePerSqFt, setFeePerSqFt] = useState('');
    // const [feePerParkingSpot, setFeePerParkingSpot] = useState('');
    // const [totalUnitFee, setTotalUnitFee] = useState('');
    // const [totalParkingFee, setTotalParkingFee] = useState('');
    // const [grandTotal, setGrandTotal] = useState('');
  
    // useEffect(() => {
    //     // Assuming Firebase is properly initialized
    //     const db = firebase.firestore();
  
    //     // Fetch condo size and parking spots for the owner
    //     const fetchOwnerDetails = async () => {
    //         // Replace 'ownerDetails' with your actual collection and document
    //         const ownerDoc = await db.collection('ownerDetails').doc('currentOwner').get();
    //         if (ownerDoc.exists) {
    //         const ownerData = ownerDoc.data();
    //         setCondoSize(ownerData?.condoSize.toString());
    //         setParkingSpots(ownerData?.parkingSpots.toString());
    //         }
    //     };
  
    //     // Fetch fee rates
    //     const fetchFeeRates = async () => {
    //         const ratesDoc = await db.collection('rates').doc('current').get();
    //         if (ratesDoc.exists) {
    //         const ratesData = ratesDoc.data();
    //         setFeePerSqFt(ratesData?.feePerSqFt.toString());
    //         setFeePerParkingSpot(ratesData?.feePerParkingSpot.toString());
    //         }
    //     };
  
    //     fetchOwnerDetails();
    //     fetchFeeRates();
    // }, []);
  
    // useEffect(() => {
    //   // Calculate total unit fee
    //   const calculatedTotalUnitFee = parseFloat(condoSize) * parseFloat(feePerSqFt);
    //   setTotalUnitFee(calculatedTotalUnitFee.toFixed(2)); // assuming 2 decimal places
  
    //   // Calculate total parking fee
    //   const calculatedTotalParkingFee = parseInt(parkingSpots, 10) * parseFloat(feePerParkingSpot);
    //   setTotalParkingFee(calculatedTotalParkingFee.toFixed(2)); // assuming 2 decimal places
  
    //   // Calculate grand total
    //   setGrandTotal((calculatedTotalUnitFee + calculatedTotalParkingFee).toFixed(2)); // assuming 2 decimal places
    // }, [condoSize, parkingSpots, feePerSqFt, feePerParkingSpot]);
  
    return (
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


export default CondoFeeCalculation;
