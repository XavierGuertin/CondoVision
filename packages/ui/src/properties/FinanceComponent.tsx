import React, { useState } from "react";
import PropertyFinanceCard from "../finance/PropertyFinanceCard";

const FinanceComponent = ({ selectedProperty }: any) => {
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

        <div className="w-full h-full pl-2">
            <h1 className="text-2xl font-bold text-white py-2">Finance</h1>
            <PropertyFinanceCard
              property={selectedProperty}
            />
          </div>
      </div>
    )
  );
};

export default FinanceComponent;