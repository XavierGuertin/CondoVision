import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  ActivityIndicator,
} from "react-native";
import { db } from "web/firebase";

/**
 * Displays the payment status and history for a condo unit.
 */
const CondoPaymentFeeStatusAndHistoryScreen = () => {
  const [loading, setLoading] = useState(true); // Track loading state
  const [isPayed, setIsPayed] = useState(true); // Track if the current fee is paid
  const [payments, setPayments] = useState([]); // Store payment history

  const navigation = useNavigation(); // Navigation hook for routing

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      // Retrieve stored condo and property IDs
      const condoId = await AsyncStorage.getItem("unitId");
      const propertyId = await AsyncStorage.getItem("propertyId");

      // Fetch condo unit details to check payment status
      const condoSnapshot = await getDoc(doc(db, "properties", propertyId, "condoUnits", condoId));
      const data = condoSnapshot.data();
      const isSnapshotPayed: boolean = data.condoFees.isPayed;
      setIsPayed(isSnapshotPayed);

      // Fetch payments history
      const paymentsSnapshots = await getDocs(
        query(collection(db, "payments"), where("condoId", "==", condoId))
      );

      const paymentDocs = paymentsSnapshots.docs;

      const paymentList: object[] = [];
      paymentDocs.forEach((paymentDoc) => {
        const data = paymentDoc.data();

        const paymentObject = {
          id: paymentDoc.id,
          condoId: data.condoId,
          propertyId: data.propertyId,
          payer: data.payer,
          propertyOwner: data.propertyOwner,
          payment: {
            date: data.payment.date,
            amount: data.payment.amount,
            isOnTime: data.payment.isOnTime,
          },
        };
        paymentList.push(paymentObject);
      });
      setPayments(paymentList);
    };
    fetchData();
    setTimeout(() => {
      setLoading(false); // Data fetch complete
    }, 1000);
  }, []);

  // Converts timestamp seconds to a human-readable date
  const secondsToDate = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const returnDate = date.toISOString();
    return returnDate.slice(0, returnDate.indexOf("T"));
  };

  // Render loading spinner or content based on loading state
  return loading ? (
    <View style={styles.loading}>
      <ActivityIndicator size={"large"} />
    </View>
  ) : (
    <View style={styles.container}>
      <View style={styles.backButton}>
        <Button
          title="Back"
          onPress={() => navigation.navigate("CondoUnitDescriptionScreen")}
        />
      </View>
      <Text style={styles.title}>Fee Status</Text>
      <View style={styles.statusContainer}>
        <Text style={styles.statusTitle}>Current Status: </Text>
        {isPayed ? (
          <Text style={styles.paid}>Paid</Text>
        ) : (
          <Text style={styles.notPaid}>Not Paid</Text>
        )}
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.billContainer}>
          <Text style={styles.billTitle}>Bills</Text>
          <View style={styles.historyContainer}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyHeaderElement}>Date</Text>
              <Text style={styles.historyHeaderElement}>Status</Text>
            </View>
            {payments.map((paymentEl) => (
              <View style={styles.historyElement} key={paymentEl.id}>
                <Text style={styles.dateText}>
                  {secondsToDate(paymentEl.payment.date.seconds)}
                </Text>
                {paymentEl.payment.isOnTime ? (
                  <Text style={styles.onTimeBill}>Paid</Text>
                ) : (
                  <Text style={styles.lateBill}>Late</Text>
                )}
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: "20%",
    paddingTop: "20%",
    width: "100%",
    height: "100%",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    paddingLeft: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 60,
    marginBottom: 20,
  },
  statusContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    width: "90%",
    justifyContent: "center",
    padding: 20,
    borderRadius: 20,
  },
  statusTitle: { fontSize: 30 },
  contentContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 20,
  },
  billContainer: {
    width: "90%",
    padding: 20,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
  },
  billTitle: {
    fontSize: 25,
  },
  historyContainer: {
    width: "100%",
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  historyHeaderElement: {
    fontSize: 20,
  },
  historyElement: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  notPaid: {
    fontSize: 30,
    color: "red",
  },
  paid: {
    fontSize: 30,
    color: "green",
  },
  lateBill: {
    fontSize: 15,
    color: "red",
  },
  onTimeBill: {
    fontSize: 15,
    color: "green",
  },
  dateText: {
    fontSize: 15,
  },
});

export default CondoPaymentFeeStatusAndHistoryScreen;
