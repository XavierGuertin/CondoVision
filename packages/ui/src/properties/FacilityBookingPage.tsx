/*
  FacilityBookingPage facilitates booking of property facilities using Firebase Firestore,
  allowing users to select dates and times for available facilities. It employs a DatePicker for date selection and updates bookings in real-time.
 */

import React, { useState, useEffect } from 'react';
import { db } from '@web/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// @ts-ignore
const FacilityBookingPage = ({ propertyId }) => {
    const [facilities, setFacilities] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedSlot, setSelectedSlot] = useState(null);

    // Fetch facilities from Firebase
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

    // @ts-ignore
    const selectSlot = (facilityIndex, hour) => {
        // @ts-ignore
        setSelectedSlot({ facilityIndex, hour });
        alert(`Time: ${hour}:00 is selected!`);
    };

    const confirmBooking = async () => {
        if (!selectedSlot) {
            alert('Please select a time slot to book.');
            return;
        }

        const userUID = localStorage.getItem("userUID"); // Adjust this to match your auth system
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

        try {
            const updatedFacilities = facilities.map((facility, index) => {
                if (index === facilityIndex) {
                    // @ts-ignore
                    return { ...facility, reservations: [...facility.reservations, reservation] };
                }
                return facility;
            });

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

    // Determine if a slot is already booked
    // @ts-ignore
    const isHourBooked = (facility, hour) => {
        // @ts-ignore
        return facility.reservations.some(reservation => {
            const reservationStart = new Date(reservation.startTime.seconds * 1000);
            return reservationStart.getDate() === selectedDate.getDate() &&
                reservationStart.getMonth() === selectedDate.getMonth() &&
                reservationStart.getFullYear() === selectedDate.getFullYear() &&
                reservationStart.getHours() === hour;
        });
    };

    // @ts-ignore
    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold text-center mb-6">Booking System</h2>
            {facilities.length > 0 ? (
                <div>
                    {facilities.map((facility, facilityIndex) => (
                        <div key={facility.facilityName} className="mb-4">
                            <h3 className="text-xl font-semibold mb-2">{facility.facilityName}</h3>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {Array.from({ length: facility.closeHour - facility.openHour }, (_, index) => {
                                    const hour = facility.openHour + index;
                                    const booked = isHourBooked(facility, hour);
                                    return (
                                        <button
                                            key={hour}
                                            disabled={booked}
                                            onClick={() => !booked && selectSlot(facilityIndex, hour)}
                                            className={`py-1 px-3 rounded text-white ${booked ? 'bg-red-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-700'}`}
                                        >
                                            {`${hour}:00`}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                    <div className="mb-4">
                        <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} wrapperClassName="date-picker" />
                    </div>
                    <button onClick={confirmBooking} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Book
                    </button>
                </div>
            ) : (
                <p>There are no facilities for this property yet.</p>
            )}
        </div>
    );
};

export default FacilityBookingPage;
