import React, { useState } from "react";
import PropertyFinanceCard from "../finance/PropertyFinanceCard";

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

const FinanceComponent = ({ selectedProperty }: any) => {
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
  const [showCondoFinanceStatus, setShowCondoFinanceStatus] = useState(false);
  const [currentCondo, setCurrentCondo] = useState(condo);
  console.log("Selected Property:");
  console.log(selectedProperty);


  return (
    selectedProperty && (
      <div className="flex flex-col h-full w-full border-l border-blue-500">
        <div className="">
          <h1 className="text-2xl font-bold text-white py-2 pl-2 capitalize">
            {selectedProperty.propertyName}
          </h1>
          <p className="pl-2">Address: {selectedProperty.address}</p>
        </div>

        <div className="flex flex-row">
          {selectedProperty.units.map((condo: Condo) => (
            <button
              key={condo.id}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
              onClick={() => {
                setCurrentCondo(condo);
                setShowCondoFinanceStatus(true);
              }}
            >
              {condo.id}
            </button>
          ))}
        </div>
        <div className="w-full h-full pl-2">
            <h1 className="text-2xl font-bold text-white py-2">Finance</h1>
            <PropertyFinanceCard
              condo={currentCondo}
              property={selectedProperty}
            />
          </div>
      </div>
    )
  );
};

export default FinanceComponent;