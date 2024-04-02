import React, { useState } from 'react';
import { db } from '@web/firebase'; // Adjust the import path as necessary
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';

interface Reservation {
  userId: string;
  startTime: Date;
  endTime: Date;
}

interface Facility {
  facilityName: string;
  openHour: number;
  closeHour: number;
  reservations: Array<Reservation>;
}

interface AddFacilityModalProps {
  propertyId: string;
  isVisible: boolean;
  onClose: () => void;
}

const AddFacilityModal: React.FC<AddFacilityModalProps> = ({ propertyId, isVisible, onClose }) => {
  const [openTime, setOpenTime] = useState<number>(0);
  const [closeTime, setCloseTime] = useState<number>(24);
  const [facility, setFacility] = useState<Facility>({
    facilityName: '',
    openHour: 0,
    closeHour: 24,
    reservations: [],
  });

  const times = Array.from({ length: 25 }, (_, index) => ({
    value: index,
    label: `${index.toString().padStart(2, '0')}:00`,
  }));

  const saveFacility = async () => {
    if (facility.facilityName === "" || openTime >= closeTime) {
      alert('Invalid facility inModalation!');
      return;
    }

    try {
      facility.openHour = openTime;
      facility.closeHour = closeTime;

      const propertyRef = doc(db, 'properties', propertyId);
      await updateDoc(propertyRef, {
        facilities: arrayUnion(facility),
      });
      alert('Facility added successfully!');
      setFacility({
        facilityName: '',
        openHour: 0,
        closeHour: 24,
        reservations: [],
      });
      onClose(); // Close the modal after saving
    } catch (error) {
      console.error('Error adding facility:', error);
      alert('Failed to add facility.');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg w-1/2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Add Facility</h2>
          <button onClick={onClose} className="text-xl font-bold">&times;</button>
        </div>
        <div>
          <label className="block">Facility Name *</label>
          <input
            type="text"
            value={facility.facilityName}
            onChange={(e) => setFacility({ ...facility, facilityName: e.target.value })}
            placeholder="Facility Name"
            className="border-2 border-gray-200 rounded p-2 w-full"
          />
        </div>
        <div className="mt-4">
          <label className="block">Opening Time</label>
          <select 
            value={openTime} 
            onChange={(e) => setOpenTime(parseInt(e.target.value, 10))}
            className="border-2 border-gray-200 rounded p-2 w-full">
            {times.map((time) => (
              <option key={time.value} value={time.value}>
                {time.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4">
          <label className="block">Closing Time</label>
          <select 
            value={closeTime} 
            onChange={(e) => setCloseTime(parseInt(e.target.value, 10))}
            className="border-2 border-gray-200 rounded p-2 w-full">
            {times.map((time) => (
              <option key={time.value} value={time.value}>
                {time.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4 flex justify-end">
          <button 
            onClick={saveFacility} 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Create Facility
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFacilityModal;
