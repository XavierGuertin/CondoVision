import React, { useState } from "react";

const PropertyList = ({ ownedProperties, inView, setSelectedProperty, isModalOpen, setModalOpen }: any) => {
    const [selected, setSelected] = useState<string>(ownedProperties?.length > 0 ? ownedProperties[0].id : '');

    return (
        <div className={`${inView} min-w-36`}>
            <h1 className="text-2xl font-bold text-white pb-2 pl-2">
                Properties
            </h1>
            {ownedProperties?.map((property: any) => {
                return (
                    <div key={property.id} 
                    className={`pl-2 pr-10 py-4 border-b border-blue-500  ${selected == property.id ? 'bg-blue-500' : 'cursor-pointer'}`} 
                    onClick={() => {
                        setSelected(property.id);
                        setSelectedProperty(property);
                    }}>
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