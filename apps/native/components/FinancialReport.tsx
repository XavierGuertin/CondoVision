/*
 * Financial Report Component
 *
 * This component is designed to display a condo management company's financial reports within a React application,
 * leveraging Firebase for data storage and operations.
 *
 * User's financial data and Payments are fetched from Firestore and displayed in the Report screen of the native app.
 *
 * It makes use of React hooks for state management, including `useState` for local component state and `useEffect` for side effects.
 *
 * Key Functionalities:
 * - Displays the key financial data to condo management companies
 * - Makes calculations based on payment history and amounts owed 
 * - Shows breakdown of payments and amounts owed based on the Condo Units 
 *
 * Dependencies:
 * - React and React Icons for UI construction and iconography.
 * - Firebase and Firestore for backend data management.
 * 
 * Usage:
 * Import and include `<FinancialReport />` in your component tree to enable financial report displaying
 * within your application.
*/

import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { getAuth } from 'firebase/auth';
import { db } from '@native/firebase'; // Ensure the correct path
import { collection, query, where, getDocs } from 'firebase/firestore';

// Interfaces
interface CondoUnit {
    size: number;
    condoFees: {
        monthlyFee: string; 
    };
}

interface Payment {
    payment: {
        amount: number;
    }
}

interface FinancialData {
    totalFees: number;
    totalPayments: number;
    loading: boolean;
}

interface DetailedCondoReport {
    unitId: string;
    fees: number;
    payments: number;
}

const FinancialReport: React.FC = () => {
    const [financialData, setFinancialData] = useState<FinancialData>({
        totalFees: 0,
        totalPayments: 0,
        loading: true
    });
    const [condoReports, setCondoReports] = useState<DetailedCondoReport[]>([]);
    
    // Auth to check the management company that is logged in
    useEffect(() => {
        const fetchFinancialData = async () => {
            const auth = getAuth();
            const currentUser = auth.currentUser;
            if (!currentUser) {
                console.error("No user logged in");
                setFinancialData({ ...financialData, loading: false });
                return;
            }

            try {
                // Query properties managed by the current user
                const propertiesQuery = query(collection(db, 'properties'), where('owner', '==', currentUser.uid));
                const propertiesSnapshot = await getDocs(propertiesQuery);
                let totalFees = 0;
                let detailedReports: DetailedCondoReport[] = [];

                console.log(propertiesQuery)

                for (const propertyDoc of propertiesSnapshot.docs) {
                    // Fetch condoUnits for each managed property
                    const condoUnitsSnapshot = await getDocs(collection(db, `properties/${propertyDoc.id}/condoUnits`));

                    console.log(condoUnitsSnapshot);
                    
                    // Fetch condo size and monthly fees for each condo. Multiplies and adds to counter to obtains the total fees
                    for (const condoDoc of condoUnitsSnapshot.docs) {
                        const condoData = condoDoc.data() as CondoUnit;
                        
                        const fees = Number(condoData.size) * Number(condoData.condoFees.monthlyFee);
                        totalFees += fees;
                    
                        const paymentsQuery = query(collection(db, 'payments'), where('condoId', '==', condoDoc.id));
                        const paymentsSnapshot = await getDocs(paymentsQuery);
                        let totalPayments = 0;
                        
                        // Fetches the payment amounts and adds it to total
                        paymentsSnapshot.forEach(paymentDoc => {
                            const paymentData = paymentDoc.data() as Payment;
                            console.log(paymentData.payment.amount);
                            const paymentAmount = paymentData.payment.amount; 
                            totalPayments += paymentAmount;
                        });
                    
                        detailedReports.push({
                            unitId: condoDoc.id,
                            fees: fees,  // Use sanitized number
                            payments: totalPayments
                        });
                    }
                }

                const overallPayments = detailedReports.reduce((acc, report) => acc + report.payments, 0);

                setFinancialData({
                    totalFees,
                    totalPayments: overallPayments,
                    loading: false
                });
                setCondoReports(detailedReports);

            } catch (error) {
                console.error("Error fetching financial data:", error);
                setFinancialData(prev => ({ ...prev, loading: false }));
            }
        };

        fetchFinancialData();
    }, []);

    if (financialData.loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Overall Financial Report</Text>
            <Text style={styles.info}>Total Fees: ${financialData.totalFees}</Text>
            <Text style={styles.info}>Total Payments Made: ${financialData.totalPayments}</Text>
            <Text style={styles.info}>Net: ${(financialData.totalPayments - financialData.totalFees)}</Text>
            <Text style={styles.title}>Detailed Condo Unit Report</Text>
            {condoReports.map((report) => (
                <View key={report.unitId} style={styles.unitReport}>
                    <Text style={styles.unitInfoTitle}>{report.unitId}</Text>
                    <Text style={styles.unitInfo}>Fees: ${report.fees}</Text>
                    <Text style={styles.unitInfo}>Payments Received: ${report.payments}</Text>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        marginBottom: 25,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    info: {
        fontSize: 18,
        marginBottom: 10,
    },
    unitReport: {
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#f0f0f0',
    },
    unitInfo: {
        fontSize: 16,
    },
    unitInfoTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default FinancialReport; 