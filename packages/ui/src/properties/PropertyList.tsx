import React, { useState } from "react";
import { Button } from "../button";

const PropertyList = ({
  ownedProperties,
  inView,
  setSelectedProperty,
  isModalOpen,
  setModalOpen,
}: any) => {
  const [selected, setSelected] = useState<string>(
    ownedProperties?.length > 0 ? ownedProperties[0].id : "",
  );

  return (
    <div className={`${inView} min-w-36`}>
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
      {ownedProperties?.map((property: any) => {
        return (
          <div
            key={property.id}
            className={`pl-2 py-4 border-b border-blue-500  ${selected == property.id ? "bg-blue-500" : "cursor-pointer"}`}
            onClick={() => {
              setSelected(property.id);
              setSelectedProperty(property);
              dispatchEvent(new Event("hideCondoFinanceStatus"));
            }}
          >
            <h1 className="font-bold text-xl capitalize">
              {property.propertyName}
            </h1>
            <p>{property.address}</p>
          </div>
        );
      })}
    </div>
  );
};

export default PropertyList;
