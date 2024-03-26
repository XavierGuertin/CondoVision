'use client';
import React, { useEffect, useState } from "react";
import { IoClose } from 'react-icons/io5'
import { db } from "@web/firebase";
import { collection, query, where, getDocs } from 'firebase/firestore';
import CondoUnitAdapter from "../../../native/components/CondoUnitAdapter";
import PropertyAdapter from "../../../native/components/PropertyAdapter";
import {
    DashboardNav,
    PropertyList,
    PropertyComponent,
    CreatePropertyModal,
} from "@ui/index";


const Page = () => {
    const [ownedProperties, setOwnedProperties] = useState<Object[]>([]);
    const [isLoading, setIsLoading] = useState<Boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<Boolean>(false);
    const [selectedProperty, setSelectedProperty] = useState<Object>();
    // Get user created properties.
    const [propertyId, setPropertyId] = useState('');
    const [unitCount, setUnitCount] = useState(0);
    const [currentUnit, setCurrentUnit] = useState(0); // Start with 0 to not display 

    const handlePropertySaved = async (propertyName: unknown, address: unknown) => {
        const propertiesRef = collection(db, 'properties');
        const q = query(propertiesRef, where("propertyName", "==", propertyName), where("address", "==", address));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            setPropertyId(doc.id);
            setUnitCount(doc.data().unitCount);
            setCurrentUnit(1); // Start adding units after property is saved
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            const propertyList: Object[] = [];
            try {
                const propertiesCollectionSnapshot = await getDocs(
                    collection(db, "properties")
                );

                propertiesCollectionSnapshot.forEach(async (propertyDoc) => {
                    const unitList: Object[] = [];
                    const condoUnitsSnapshot = await getDocs(
                        collection(db, "properties", propertyDoc.id, "condoUnits")
                    );
                    const userUID = await localStorage.getItem("userUID");
                    let stopper = true;
                    let propertyData = propertyDoc.data();

                    condoUnitsSnapshot.forEach((condoUnitDoc) => {
                        let condoData = condoUnitDoc.data();
                        let condoId = condoUnitDoc.id;

                        if (condoData.owner === userUID && stopper) {
                            const condoUnit = new CondoUnitAdapter(
                                condoId,
                                {
                                    includes: condoData.condoFees.includes,
                                    monthlyFee: condoData.condoFees.monthlyFee,
                                },
                                condoData.lockerId,
                                {
                                    contact: condoData.occupantInfo.contact,
                                    name: condoData.occupantInfo.name,
                                },
                                condoData.owner,
                                condoData.parkingSpotId,
                                condoData.size,
                                condoData.unitId
                            );
                            unitList.push(condoUnit.toJSON());
                            console.log(unitList);
                            stopper = false;
                        }
                    });
                    if (propertyData.owner === userUID) {
                        const property = new PropertyAdapter(
                            propertyDoc.id,
                            propertyData.address,
                            propertyData.lockerCount,
                            propertyData.owner,
                            propertyData.parkingCount,
                            propertyData.propertyName,
                            propertyData.unitCount,
                            unitList
                        );
                        propertyList.push(property.toJSON());
                        setOwnedProperties(propertyList);
                        if (propertyList.length > 0) {
                            setSelectedProperty(propertyList[0]);
                        }
                    }
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                }, 500);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="h-screen bg-gradient-to-r from-[#87A8FA] to-[#87CCFA] overflow-hidden">
            <DashboardNav />
            <div className="flex h-full">
                {isLoading ? <h1>Loading...</h1> : <PropertyList ownedProperties={ownedProperties} setSelectedProperty={setSelectedProperty} setModalOpen={setIsModalOpen} isModalOpen={isModalOpen} />}
                {isLoading ? <h1>Loading...</h1> : <PropertyComponent selectedProperty={selectedProperty} />}
            </div>
            {isModalOpen && <div className="absolute top-0 h-screen w-screen bg-black bg-opacity-20">
                <div className="flex flex-col h-full items-center justify-center z-20">
                    <div className="w-1/2 h-4/5 bg-blue-100 rounded-lg p-4 flex flex-col">
                        <button onClick={() => setIsModalOpen(false)} className="self-end flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full w-8 h-9"><IoClose className="text-2xl" /></button>
                        <CreatePropertyModal onPropertySaved={handlePropertySaved} />
                    </div>
                </div>
            </div>}
        </div>
    );
};
export default Page;