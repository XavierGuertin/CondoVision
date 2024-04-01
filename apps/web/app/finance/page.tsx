'use client';
import React, { useEffect, useState } from "react";
import { IoClose } from 'react-icons/io5'
import { db } from "@web/firebase";
import { collection, query, where, getDocs } from 'firebase/firestore';
import CondoUnitAdapter from "../../../native/components/CondoUnitAdapter";
import PropertyAdapter from "../../../native/components/PropertyAdapter";
import {
    DashboardNav,
    PropertyListFinance,
    PropertyComponent,
} from "@ui/index";



const Page = () => {
    const [ownedProperties, setOwnedProperties] = useState<Object[]>([]);
    const [isLoading, setIsLoading] = useState<Boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<Boolean>(false);
    const [selectedProperty, setSelectedProperty] = useState<Object>();
    /*** Used for creating the right amount of units and to pair them properly.*/
    const [propertyId, setPropertyId] = useState('');
    const [unitCount, setUnitCount] = useState(0);
    const [currentUnit, setCurrentUnit] = useState(0); // Start with 0 to not display 

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
                {isLoading ? <h1>Loading...</h1> : <PropertyListFinance ownedProperties={ownedProperties} setSelectedProperty={setSelectedProperty} setModalOpen={setIsModalOpen} isModalOpen={isModalOpen} />}
                {isLoading ? <h1>Loading...</h1> : <PropertyComponent selectedProperty={selectedProperty} />}
            </div>
        </div>
    );
};

export default Page;