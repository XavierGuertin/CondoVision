import React, { useState } from 'react'
import { db } from '@web/firebase';
import { collection, addDoc } from 'firebase/firestore';

// Defines the shape of a CondoProperty object.
type CondoProperty = {
    propertyName: string;
    unitCount: number;
    parkingCount: number;
    lockerCount: number;
    address: string;
    owner: string;
};

const initialCondoState: CondoProperty = {
    propertyName: '',
    unitCount: 1,
    parkingCount: 0,
    lockerCount: 0,
    address: '',
    owner: '',
};

// Props definition for AddCondoPropertyForm component.
type CreatePropertyModalProps = {
    onPropertySaved: (propertyName: string, address: string) => void;
};

const CreatePropertyModal: React.FC<CreatePropertyModalProps> = ({ onPropertySaved }) => {
    const [property, setProperty] = useState<CondoProperty>(initialCondoState);

    const handleInputChange = (field: keyof CondoProperty, value: any) => {
        setProperty((prevProperty) => ({
            ...prevProperty,
            [field]: value,
        }));
    };

    const validInput = () => {
        return property.propertyName !== '' && property.unitCount > 0 && property.address !== '';
    };

    const saveCondoProperty = async () => {
        try {
            if (!validInput()) {
                alert("Invalid property information!");
                return;
            }

            const userId = localStorage.getItem("userUID");

            if (!userId) {
                alert("User not found!");
                return;
            }

            property.owner = userId;
            await addDoc(collection(db, "properties"), property);
            alert("Condo property saved successfully!");
            setProperty(initialCondoState); // Reset form after successful save
            onPropertySaved(property.propertyName, property.address);
        } catch (error) {
            console.error("Error saving condo property:", error);
            alert("Failed to save condo property.");
        }
    };

    return (
        <>
            <h1 className="text-2xl font-bold text-center">Create Property</h1>
            <form className="flex flex-col h-full justify-around" onSubmit={(e) => {
                e.preventDefault();
                saveCondoProperty();
            }}>
                <div className="flex flex-col">
                    <label className="text-lg font-semibold">Property Name *</label>
                    <input className="border border-gray-300 rounded-lg p-2" type="text"
                        placeholder="Enter Property Name"
                        value={property.propertyName}
                        onChange={(text) => handleInputChange("propertyName", text.target.value)} />
                </div>
                <div className="flex flex-col">
                    <label className="text-lg font-semibold">Address *</label>
                    <input className="border border-gray-300 rounded-lg p-2" type="text"
                        placeholder="Enter Address"
                        value={property.address}
                        onChange={(text) => handleInputChange("address", text.target.value)} />
                </div>
                <div className="flex flex-col">
                    <label className="text-lg font-semibold">Unit Count *</label>
                    <input className="border border-gray-300 rounded-lg p-2" type="number"
                        min="1"
                        value={property.unitCount}
                        onChange={(text) => handleInputChange("unitCount", Number(text.target.value))} />
                </div>
                <div className="flex flex-col">
                    <label className="text-lg font-semibold">Locker Count</label>
                    <input className="border border-gray-300 rounded-lg p-2" type="number"
                        min="0"
                        value={property.lockerCount}
                        onChange={(text) => handleInputChange("lockerCount", Number(text.target.value))} />
                </div>
                <div className="flex flex-col">
                    <label className="text-lg font-semibold">Parking Count</label>
                    <input className="border border-gray-300 rounded-lg p-2" type="number"
                        min="0"
                        value={property.parkingCount}
                        onChange={(text) => handleInputChange("parkingCount", Number(text.target.value))} />
                </div>
                <button className="bg-blue-500 text-white rounded-lg p-2 mt-4" type='submit'>Create Property</button>
            </form>
        </>
    )
}

export default CreatePropertyModal