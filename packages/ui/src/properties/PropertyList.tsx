import React, { useState } from "react";
import { Button } from "../button";

const PropertyList = ({
  ownedProperties,
  setSelectedProperty,
  isModalOpen,
  setModalOpen,
  className,
}: any) => {
  const [selected, setSelected] = useState<string>(
    ownedProperties?.length > 0 ? ownedProperties[0].id : "",
  );

  return (
    <div className={"min-w-[240px] ${className}"}>
      <h1 className="text-2xl font-bold text-white pb-2 pl-2">
        Properties list
      </h1>
      {localStorage.getItem("userRole") === "Condo Management Company" ? (
        <div className="mr-8 ml-1 -mt-2">
          <Button
            onClick={() => {
              setModalOpen(!isModalOpen);
            }}
            text={"Add Property"}
          />
        </div>
      ) : null}
      <div style={{display: 'flex', flexDirection: 'column'}}>
      {ownedProperties?.map((property: any) => {
        return (
          <button 
              key={property.id}
              className={`pl-2 pr-10 py-4 border-b border-blue-500  ${selected == property.id ? 'bg-blue-500' : 'cursor-pointer'}`}
              onClick={() => {
                setSelected(property.id);
                setSelectedProperty(property);
                dispatchEvent(new Event("hideCondoFinanceStatus"));
                dispatchEvent(new Event("hideCondoFeeCalcStatus"));
              }}
          >
            <h1 className="font-bold text-xl capitalize">
              {property.propertyName}
            </h1>
            <p>{property.address}</p>
          </button>
        );
      })}
      </div>
    </div>
  );
};
export default PropertyList;
