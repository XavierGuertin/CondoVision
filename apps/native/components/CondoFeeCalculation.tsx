import { getStorage, ref, uploadBytes, uploadString, getDownloadURL } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';
import { collection, addDoc } from "firebase/firestore";

const BoldLabelWithValue = ({ label, value }) => {
    return (
      <View style={styles.row}>
        <Text style={styles.boldLabel}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    );
};

const FeeCalculationRow = ({label1, value1, label2, value2}) => {
    return (
        <View style={styles.rowWithSymbol}>
            <BoldLabelWithValue label={label1} value={value1} />
            <Text style={styles.multiplySymbol}> * </Text>
            <BoldLabelWithValue label={label2} value={value2} />
        </View>
    );
};
  
const CondoFeeCalculation = () => {
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
      <View style={styles.container}>
        <Text style={styles.header}>Fee Calculation</Text>
        <View style={styles.section}>
          <FeeCalculationRow
            label1="Condo Dimensions (ft²) = " 
            value1={3}
            label2="Fee per (ft²) = " 
            value2={3}
          />
          <Text style={styles.totalText}>Total Unit Fee ($) = {9} $</Text>
        </View>
        <View style={styles.section}>
            <FeeCalculationRow 
                label1="Parking Spot(s) = " 
                value1={1} 
                label2="Fee per Parking Spot ($) = " 
                value2={54}
            />
          <Text style={styles.totalText}>Total Parking Spot(s) Fee($) = {54} $</Text>
        </View>
        <View style={styles.section}>
          {/* <Text style={styles.grandTotalText}>TOTAL FEES = {grandTotal}</Text> */}
          <Text style={styles.grandTotalText}>TOTAL FEES = 64$</Text>
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
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
    boldLabel: {
        fontWeight: 'bold',
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
    row: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        backgroundColor: 'lightpink',
        borderRadius: 8,
        paddingVertical: 5,
        paddingHorizontal: 20,
    },
    rowWithSymbol: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        alignItems: 'center', // align items vertically
    },
    value: {
        marginRight: 4, // add some spacing before the multiplication symbol
    },
    multiplySymbol: {
        fontWeight: 'bold',
        fontSize: 18, // size your multiplication symbol
        marginRight: 4, // add some spacing after the multiplication symbol
    },
    // ... other styles as needed
});


export default CondoFeeCalculation;
