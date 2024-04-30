import React, { useState } from "react";
import PropertyFinanceCard from "../finance/PropertyFinanceCard";

//Displays the selected property's name, address... and loads its respective finance table (ProperyFinanceCard)
const FinanceComponent = ({ selectedProperty, showFees, setShowFees }: any) => {
  console.log("Selected Property:");
  console.log(selectedProperty);

  return (
    selectedProperty ? (
      <div className="flex flex-col h-full w-full border-l border-blue-500">
        <div className="">
          <h1 className="text-2xl font-bold text-white py-2 pl-2 capitalize">
            {selectedProperty.propertyName}
          </h1>
          <p className="pl-2">Address: {selectedProperty.address}</p>
        </div>

        <div className="w-full h-full pl-2">
            <h1 className="text-2xl font-bold text-white py-2">Finance</h1>
            <PropertyFinanceCard
              property={selectedProperty}
              showFees={showFees} 
              setShowFees={setShowFees} 
            />
          </div>
      </div>
    ) : (
      <div>No property selected</div>
    )
  );
};

export default FinanceComponent;
