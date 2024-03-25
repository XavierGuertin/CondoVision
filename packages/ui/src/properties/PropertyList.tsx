import React, { useState } from "react";
import { Button } from "../button";

const PropertyList = ({ ownedProperties, inView, setSelectedProperty, openModal }: any) => {
    const [selected, setSelected] = useState<string>(ownedProperties?.length > 0 ? ownedProperties[0].id : '');
    const [isModalOpenAddProperty, setIsModalOpenAddProperty] = useState(false);

    const toggleModalAddProperty = () => {
        setIsModalOpenAddProperty(!isModalOpenAddProperty);
    };


    return (
        <div className={`${inView} min-w-36`}>
            <h1 className="text-2xl font-bold text-white pb-2 pl-2">
                Properties list
            </h1>
            <div className="mr-8 ml-1 -mt-2">
                <Button onClick={() => {
                    toggleModalAddProperty();
                    openModal(isModalOpenAddProperty);
                }} text={"Add Unit"} />
            </div>
            {ownedProperties?.map((property: any) => {
                return (
                    <div key={property.id} className={`pl-2 py-4 border-b border-blue-500  ${selected == property.id ? 'bg-blue-500' : 'cursor-pointer'}`} onClick={() => {
                        setSelected(property.id);
                        setSelectedProperty(property);
                    }}>
                        <h1 className="font-bold text-xl capitalize">{property.propertyName}
                        </h1>
                        <p>{property.address}</p>
                    </div>
                );
            })}
        </div>
    );
};

export default PropertyList;
