import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import FinancialReport from '@native/components/FinancialReport';

//Generate the Report from the FinantialReport component
const ReportScreen = ({ navigation }: any) => {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Annual Financial Report</Text>
            <FinancialReport />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default ReportScreen;