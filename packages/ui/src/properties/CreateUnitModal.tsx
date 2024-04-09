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
            <h1 className="text-2xl font-bold text-center">Add a Unit</h1>
            <form className="flex flex-col h-full justify-start overflow-y-auto" onSubmit={(e) => {
                e.preventDefault();
                saveCondoUnit();
            }}>
                <div className="flex flex-col">
                    <label className="text-lg font-semibold">Unit ID *</label>
                    <input className="border border-gray-300 rounded-lg p-2" type="text"
                        placeholder="Enter Unit ID"
                        value={unit.unitId}
                        onChange={(text) => handleInputChange("unitId", text.target.value)} />
                </div>
                <div className="flex flex-col">
                    <label className="text-lg font-semibold">Size *</label>
                    <input className="border border-gray-300 rounded-lg p-2" type="text"
                        placeholder="Enter Unit Size"
                        value={unit.size}
                        onChange={(text) => handleInputChange("size", text.target.value)} />
                </div>
                <div className="flex flex-col">
                    <label className="text-lg font-semibold">Owner</label>
                    <input className="border border-gray-300 rounded-lg p-2" type="text"
                        placeholder="Enter Owner"
                        value={unit.owner}
                        onChange={(text) => handleInputChange("owner", text.target.value)} />
                </div>
                <div className="flex flex-col">
                    <label className="text-lg font-semibold">Occupant Name</label>
                    <input className="border border-gray-300 rounded-lg p-2" type="text"
                        placeholder="Enter Occupant Name"
                        value={unit.occupantInfo.name}
                        onChange={(text) => handleInputChange('occupantInfo', { ...unit.occupantInfo, name: text.target.value })} />
                </div>
                <div className="flex flex-col">
                    <label className="text-lg font-semibold">Occupant Contact</label>
                    <input className="border border-gray-300 rounded-lg p-2" type="text"
                        placeholder="Enter Occupant Contact"
                        value={unit.occupantInfo.contact}
                        onChange={(text) => handleInputChange('occupantInfo', { ...unit.occupantInfo, contact: text.target.value })} />
                </div>
                <div className="flex flex-col">
                    <label className="text-lg font-semibold">Monthly Condo Fees *</label>
                    <input className="border border-gray-300 rounded-lg p-2" type="text"
                        placeholder="Enter Monthly Condo Fees"
                        value={unit.condoFees.monthlyFee}
                        onChange={(text) => handleInputChange('condoFees', { ...unit.condoFees, monthlyFee: text.target.value })} />
                </div>
                <div className="flex flex-col">
                    <label className="text-lg font-semibold">Parking Spot ID</label>
                    <input className="border border-gray-300 rounded-lg p-2" type="text"
                        placeholder="Enter Parking Spot ID"
                        value={unit.parkingSpotId}
                        onChange={(text) => handleInputChange('parkingSpotId', text.target.value)} />
                </div>
                <div className="flex flex-col">
                    <label className="text-lg font-semibold">Locker ID</label>
                    <input className="border border-gray-300 rounded-lg p-2" type="text"
                        placeholder="Enter Locker ID"
                        value={unit.lockerId}
                        onChange={(text) => handleInputChange('lockerId', text.target.value)} />
                </div>
                <button className="bg-blue-500 text-white rounded-lg p-2 mt-4" type="submit">Save Condo Unit</button>
            </form>
        </>
    );
};

export default CreateUnitModal;