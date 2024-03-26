import React, { useState } from "react";
import { db } from '@web/firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';

type OccupantInfo = {
    name: string;
    contact: string;
};

type CondoFees = {
    monthlyFee: string;
    includes: string[];
};

type Unit = {
    unitId: string;
    size: string;
    owner: string;
    occupantInfo: OccupantInfo;
    condoFees: CondoFees;
    parkingSpotId: string;
    lockerId: string;
};

const initialUnitState: Unit = {
    unitId: '',
    size: '',
    owner: '',
    occupantInfo: { name: '', contact: '' },
    condoFees: { monthlyFee: '', includes: [] },
    parkingSpotId: '',
    lockerId: '',
};

type CondoUnitFormProps = {
    propertyId: string;
    onUnitSaved: () => void; // Add this callback function type
};

const CreateUnitModal: React.FC<CondoUnitFormProps> = ({ propertyId, onUnitSaved }) => {
    const [unit, setUnit] = useState<Unit>(initialUnitState);

    const handleInputChange = (field: keyof Unit, value: any) => {
        setUnit((prevUnit) => ({
            ...prevUnit,
            [field]: value,
        }));
    };

    const saveCondoUnit = async () => {
        if (!validInput()) {
            alert('Invalid unit information!');
            return;
        }
        const propertyRef = doc(db, 'properties', propertyId);
        const propertyDoc = await getDoc(propertyRef);
        if (!propertyDoc.exists()) {
            alert('Property does not exist.');
            return;
        }

        try {
            // Add the condo unit to the 'condoUnits' subcollection of the found property
            await addDoc(collection(db, `properties/${propertyId}/condoUnits`), {
                ...unit,
            });
            alert('Condo unit saved successfully!');
            setUnit(initialUnitState); // Reset form after successful save
            onUnitSaved();
        } catch (error) {
            console.error('Error saving condo unit:', error);
            alert('Failed to save condo unit.');
        }
    };

    const validInput = () => {
        return unit.unitId != "" && unit.size != "" && unit.condoFees.monthlyFee != "";
    }

    return (
        <>
            <h1 className="text-2xl font-bold text-center">Add a Unit</h1><form className="flex flex-col h-full justify-around">
                <div className="flex flex-col">
                    <label className="text-lg font-semibold">Property Name</label>
                    <input className="border border-gray-300 rounded-lg p-2" type="text"
                        placeholder="Enter Property Name"
                        value={property.propertyName}
                        onChange={(text) => handleInputChange("propertyName", text.target.value)} />
                </div>
                <div className="flex flex-col">
                    <label className="text-lg font-semibold">Address</label>
                    <input className="border border-gray-300 rounded-lg p-2" type="text"
                        placeholder="Enter Address"
                        value={property.address}
                        onChange={(text) => handleInputChange("address", text.target.value)} />
                </div>
                <div className="flex flex-col">
                    <label className="text-lg font-semibold">Unit Count</label>
                    <input className="border border-gray-300 rounded-lg p-2" type="number"
                        value={property.unitCount}
                        onChange={(text) => handleInputChange("unitCount", Number(text.target.value))} />
                </div>
                <div className="flex flex-col">
                    <label className="text-lg font-semibold">Locker Count</label>
                    <input className="border border-gray-300 rounded-lg p-2" type="number"
                        value={property.lockerCount}
                        onChange={(text) => handleInputChange("lockerCount", Number(text.target.value))} />
                </div>
                <div className="flex flex-col">
                    <label className="text-lg font-semibold">Parking Count</label>
                    <input className="border border-gray-300 rounded-lg p-2" type="number"
                        value={property.parkingCount}
                        onChange={(text) => handleInputChange("parkingCount", Number(text.target.value))} />
                </div>
                <button className="bg-blue-500 text-white rounded-lg p-2 mt-4" onClick={() => console.log()}>Create Property</button>
            </form>
        </>
    );
};

export default CreateUnitModal;