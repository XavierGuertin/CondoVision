import React, { useState } from "react";
import DefaultFinanceCard from "../finance/DefaultFinanceCard";
import DefaultCondoFeeCalcCard from "../finance/DefaultCondoFeeCalcCard";
import AddFacilityModal from "./AddFacilitiesModal";
import EmployeeListModalWeb from "./EmployeeListModalWeb"; 
type Condo = {
  id: number;
  condoFees: {
    includes: [];
    isPayed: boolean;
    monthlyFee: string;
  };
  lockerId: string;
  occupantInfo: {
    contact: string;
    name: string;
  };
  owner: string;
  parkingSpotId: string;
  size: string;
  unitId: string;
};

const PropertyComponent = ({ selectedProperty, onBookFacilityClick }: any) => {
  const condo: Condo = {
    id: -1,
    condoFees: {
      includes: [],
      isPayed: false,
      monthlyFee: "1",
    },
    lockerId: "",
    occupantInfo: {
      contact: "",
      name: "",
    },
    owner: "",
    parkingSpotId: "",
    size: "",
    unitId: "",
  };
  const [showAddFacilityModal, setShowAddFacilityModal] = useState(false);
  const [showEmployeeListModal, setShowEmployeeListModal] = useState(false);
  const [showCondoFinanceStatus, setShowCondoFinanceStatus] = useState(false);
  const [currentCondo, setCurrentCondo] = useState(condo);
  console.log("Selected Property:");
  console.log(selectedProperty);

  // Toggle the visibility of the AddFacilityModal
  const toggleAddFacilityModal = () =>
    setShowAddFacilityModal(!showAddFacilityModal);

  // Toggle the visibility of the EmployeeList
  const toggleEmployeeListModal = () => setShowEmployeeListModal(!showEmployeeListModal);

  addEventListener("hideCondoFinanceStatus", () => {
    setShowCondoFinanceStatus(false);
  });
  return (
    selectedProperty && (
      <div className="flex flex-col flex-grow overflow-y-auto border-l border-blue-500" style={{ height: 'calc(100vh - 10rem)' }}>
        <div className="">
          <h1 className="text-2xl font-bold text-white py-2 pl-2 capitalize">
            {selectedProperty.propertyName}
          </h1>
          <p className="pl-2">Address: {selectedProperty.address}</p>
          <div className="flex space-x-2 pl-2">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
              onClick={onBookFacilityClick}
            >
              Book Facility
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
              onClick={toggleAddFacilityModal}
            >
              Add Facility
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
              onClick={toggleEmployeeListModal}
            >
              View Employees
            </button>
          </div>
        </div>
        <h1 className="mt-3 text-2xl font-bold text-white py-2 pl-2 capitalize">
          Condo Units
        </h1>
        <div className="flex flex-row flex-wrap pl-2">
          {selectedProperty.units.map((condo: Condo) => (
            <button
              key={condo.id}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
              onClick={() => {
                setCurrentCondo(condo);
                setShowCondoFinanceStatus(true);
              }}
            >
              {condo.unitId}
            </button>
          ))}
        </div>
        {showAddFacilityModal && (
          <AddFacilityModal
            propertyId={selectedProperty.id}
            isVisible={showAddFacilityModal}
            onClose={toggleAddFacilityModal}
          />
        )}
        {showEmployeeListModal && (
          <EmployeeListModalWeb
            propertyId={selectedProperty.id}
            isVisible={showEmployeeListModal}
            onClose={toggleEmployeeListModal}
          />
        )}
        {showCondoFinanceStatus && (
          <div className="w-full h-full pl-2">
            <h1 className="text-2xl font-bold text-white py-2">Finance</h1>
            <DefaultFinanceCard
              condo={currentCondo}
              property={selectedProperty}
            />
            <h1 className="text-2xl font-bold text-white py-2">Fee Calculator</h1>
            <DefaultCondoFeeCalcCard 
              condo={currentCondo}
              property={selectedProperty} 
            />
          </div>
        )}
      </div>
    )
  );
};

export default PropertyComponent;

