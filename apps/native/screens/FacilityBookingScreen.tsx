import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { db } from '../firebase'; // Adjust this path to your firebase configuration file
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FacilityBookingScreen = ({ route }) => {
    const [facilities, setFacilities] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedSlot, setSelectedSlot] = useState(null);
    const propertyId = route.params.propertyId;

    const fetchFacilities = async () => {
        const propertyRef = doc(db, 'properties', propertyId);
        const docSnap = await getDoc(propertyRef);

        if (docSnap.exists() && Array.isArray(docSnap.data().facilities)) {
            setFacilities(docSnap.data().facilities);
        } else {
            console.log('Facilities data not found or is not in expected format!');
        }
    };

    useEffect(() => {

        fetchFacilities();
    }, [propertyId]);

    const onDateChange = (event, selectedDate) => {
        setSelectedDate(selectedDate);
    };

    const selectSlot = (facilityIndex, hour) => {
        setSelectedSlot({ facilityIndex, hour });
        alert("Time: " + hour + " is selected!")
    };

    const confirmBooking = async () => {
        if (!selectedSlot) {
            alert('Please select a time slot to book.');
            return;
        }

        const userUID = await AsyncStorage.getItem("userUID");
        if (!userUID) {
            alert('User ID not found.');
            return;
        }

        const { facilityIndex, hour } = selectedSlot;
        const startTime = new Date(selectedDate);
        startTime.setHours(hour, 0, 0, 0);
        const endTime = new Date(startTime);
        endTime.setHours(hour + 1);

        const reservation = {
            userId: userUID,
            startTime: startTime,
            endTime: endTime,
        };

        const updatedFacilities = facilities.map((facility, index) => {
            if (index === facilityIndex) {
                // @ts-ignore
                return { ...facility, reservations: [...facility.reservations, reservation] };
            }
            return facility;
        });

        try {
            const propertyRef = doc(db, 'properties', propertyId);
            await updateDoc(propertyRef, {
                facilities: updatedFacilities,
            });
            alert('Booking successful!');
            setSelectedSlot(null);
            fetchFacilities();
        } catch (error) {
            console.error('Error booking facility:', error);
            alert('Failed to book facility.');
        }
    };

    const isHourBooked = (facility, hour) => {
        return facility.reservations.some(reservation => {
            const reservationStart = reservation.startTime.toDate();
            return reservationStart.getDate() === selectedDate.getDate() &&
                reservationStart.getMonth() === selectedDate.getMonth() &&
                reservationStart.getFullYear() === selectedDate.getFullYear() &&
                reservationStart.getHours() === hour;
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Booking System</Text>
            {facilities.length > 0 ? (
                <>
                    <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.facilityScrollView}>
                        {facilities.map((facility, facilityIndex) => (
                            <View key={facility.facilityName} style={styles.facilityColumn}>
                                <Text style={styles.facilityName}>{facility.facilityName}</Text>
                                <ScrollView showsVerticalScrollIndicator={true} style={styles.timeslotScrollView}>
                                    {Array.from({ length: facility.closeHour - facility.openHour }, (_, index) => {
                                        const hour = facility.openHour + index;
                                        const booked = isHourBooked(facility, hour);
                                        return (
                                            <TouchableOpacity
                                                key={hour}
                                                style={[styles.hourSlot, booked ? styles.bookedSlot : styles.availableSlot]}
                                                onPress={() => !booked && selectSlot(facilityIndex, hour)}
                                                disabled={booked}
                                            >
                                                <Text style={styles.hourText}>{`${hour}:00`}</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </ScrollView>
                            </View>
                        ))}
                    </ScrollView>
                    <DateTimePicker value={selectedDate} mode="date" display="default" onChange={onDateChange} style={styles.datePicker} />
                    <TouchableOpacity style={styles.bookButton} onPress={confirmBooking}>
                        <Text style={styles.bookButtonText}>BOOK</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <Text style={styles.noFacilitiesText}>There are no facilities for this property yet.</Text>
            )}
        </View>
    );


};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    facilityScrollView: {
        flexGrow: 0,
    },
    facilityColumn: {
        width: 118,
        marginHorizontal: 10,
    },
    facilityName: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    timeslotScrollView: {
        maxHeight: '100%',
    },
    hourSlot: {
        paddingVertical: 15,
        marginBottom: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    availableSlot: {
        backgroundColor: 'green',
    },
    bookedSlot: {
        backgroundColor: 'red',
    },
    hourText: {
        color: '#fff',
    },
    datePicker: {
        width: '80%',
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    bookButton: {
        backgroundColor: '#2074df',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginHorizontal: 50,
        marginBottom: 100,
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    noFacilitiesText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default FacilityBookingScreen;
