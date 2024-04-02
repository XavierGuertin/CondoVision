import React, { useState } from "react";
import DefaultFinanceCard from "../finance/DefaultFinanceCard";
import AddFacilityModal from "./AddFacilitiesModal";

const PropertyComponent = ({ selectedProperty, onBookFacilityClick }: any) => {
    const [showAddFacilityModal, setShowAddFacilityModal] = useState(false);

    // Toggle the visibility of the AddFacilityModal
    const toggleAddFacilityModal = () => setShowAddFacilityModal(!showAddFacilityModal);

    return (
        selectedProperty && (
            <div className="flex flex-col h-full w-full border-l border-blue-500">
                <div className="">
                    <h1 className="text-2xl font-bold text-white py-2 pl-2 capitalize">{selectedProperty.propertyName}</h1>
                    <p className="pl-2">Address: {selectedProperty.address}</p>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                        onClick={onBookFacilityClick}
                    >
                        Book Facility
                    </button>
                    {/* Use a button to toggle the AddFacilityModal visibility */}
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mt-2"
                        onClick={toggleAddFacilityModal}
                    >
                        Add Facility
                    </button>
                </div>
                <div className="w-full h-full pl-2">
                    <h1 className="text-2xl font-bold text-white py-2">Finance</h1>
                    <DefaultFinanceCard url="#" />
                </div>
                {/* Conditionally render the AddFacilityModal based on the state
                    Pass the isVisible and onClose props to control the modal */}
                {showAddFacilityModal && (
                    <AddFacilityModal 
                        propertyId={selectedProperty.id} 
                        isVisible={showAddFacilityModal} 
                        onClose={toggleAddFacilityModal}
                    />
                )}
            </div>
        )
    );
};

export default PropertyComponent;
