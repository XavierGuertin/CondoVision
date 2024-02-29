import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface OccupantInfo {
    name: string;
    contact: string;
}

interface CondoFees {
    monthlyFee: string;
    includes: string[];
}

interface Unit {
    unitId: string;
    size: string;
    owner: string;
    occupantInfo: OccupantInfo;
    condoFees: CondoFees;
}

interface ParkingSpot {
    parkingSpotId: string;
    spotOwner: string;
    occupantInfo: OccupantInfo;
    condoFees: CondoFees;
}

interface Locker {
    lockerId: string;
    lockerOwner: string;
    occupantInfo: OccupantInfo;
    condoFees: CondoFees;
}

interface CondoUnitProps {
    unit: Unit;
    parkingSpot: ParkingSpot;
    locker: Locker;
}

// Example data
const exampleData: CondoUnitProps = {
    unit: {
        unitId: 'Unit 101',
        size: '1200 sqft',
        owner: 'John Doe',
        occupantInfo: {
            name: 'Jane Doe',
            contact: '555-1234',
        },
        condoFees: {
            monthlyFee: '$300',
            includes: ['Water', 'Heating'],
        },
    },
    parkingSpot: {
        parkingSpotId: 'Spot 12',
        spotOwner: 'John Doe',
        occupantInfo: {
            name: 'John Doe',
            contact: '555-5678',
        },
        condoFees: {
            monthlyFee: '$50',
            includes: ['Snow Removal'],
        },
    },
    locker: {
        lockerId: 'Locker 5',
        lockerOwner: 'John Doe',
        occupantInfo: {
            name: 'Jane Doe',
            contact: '555-9101',
        },
        condoFees: {
            monthlyFee: '$25',
            includes: ['Secure Access'],
        },
    },
};

interface CondoUnitComponentProps {
    data?: CondoUnitProps;
    open?: boolean;
    propertyId: number;
}

export const CondoUnitComponent: React.FC<CondoUnitComponentProps> = ({ data = exampleData, open = false, propertyId }) => {
    const [expanded, setExpanded] = useState(open);

    return (
        <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.container}>
            <View>
                <Text style={styles.header}>Unit Details</Text>
                {expanded && (
                    <ScrollView style={styles.expandedScrollView}>
                        {/* Unit Information */}
                        <View style={styles.detailSection}>
                            <Text style={styles.infoTitle}>Property ID: {propertyId}</Text>
                            <Text style={styles.infoTitle}>Unit ID:</Text>
                            <Text style={styles.infoText}>{data.unit.unitId}</Text>
                            <Text style={styles.infoTitle}>Size:</Text>
                            <Text style={styles.infoText}>{data.unit.size}</Text>
                            <Text style={styles.infoTitle}>Parking Spot ID:</Text>
                            <Text style={styles.infoText}>{data.parkingSpot.parkingSpotId}</Text>
                            <Text style={styles.infoTitle}>Locker ID:</Text>
                            <Text style={styles.infoText}>{data.locker.lockerId}</Text>
                            <Text style={styles.infoTitle}>Condo Fees:</Text>
                            <Text style={styles.infoText}>{data.unit.condoFees.monthlyFee}</Text>
                        </View>

                        {/* Parking Spot Information */}
                        <View style={styles.detailSection}>
                            <Text style={styles.infoTitle}>Occupant Name:</Text>
                            <Text style={styles.infoText}>{data.unit.occupantInfo.name}</Text>
                        </View>

                        {/* Locker Information */}
                        <View style={styles.detailSection}>
                            <Text style={styles.infoTitle}>Owner Name:</Text>
                            <Text style={styles.infoText}>{data.unit.owner}</Text>
                        </View>
                    </ScrollView>
                )}
            </View>
        </TouchableOpacity>
    );
};

// Add your styles here
const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 10,
        overflow: 'hidden',
        margin: 10,
        backgroundColor: '#FFFFFF',
        elevation: 3,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        padding: 10,
        textAlign: 'center',
    },
    detailSection: {
        padding: 10,
    },
    infoTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 4,
    },
    infoText: {
        fontSize: 16,
        marginLeft: 10,
    },
    expandedScrollView: {
        maxHeight: '80%',
    },
});

export default CondoUnitComponent;
