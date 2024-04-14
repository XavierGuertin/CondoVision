'use client';
import React, { useEffect, useState } from "react";
import { IoClose } from 'react-icons/io5'
import { db } from "@web/firebase";
import { collection, getDocs } from 'firebase/firestore';
import PropertyAdapter from "../../../native/components/PropertyAdapter";
import dynamic from 'next/dynamic';

import {
    PropertyListFinance,
    FinanceComponent,
} from "@ui/index";

const DashboardNav = dynamic(() => import('../../../../packages/ui/src/DashboardNav'), { ssr: false });

const Page = ({ user, onClose }: any) => {
    const [ownedProperties, setOwnedProperties] = useState<Object[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedProperty, setSelectedProperty] = useState<Object>();

    useEffect(() => {
        const fetchData = async () => {
            const propertyList: Object[] = [];
            try {
                const propertiesCollectionSnapshot = await getDocs(
                    collection(db, "properties")
                );

                propertiesCollectionSnapshot.forEach(async (propertyDoc) => {
                    const unitList: Object[] = [];
                    const userUID = await localStorage.getItem("userUID");
                    let stopper = true;
                    let propertyData = propertyDoc.data();

                    if (propertyData.owner === userUID) {
                        const property = new PropertyAdapter(
                            propertyDoc.id,
                            propertyData.address,
                            propertyData.lockerCount,
                            propertyData.owner,
                            propertyData.parkingCount,
                            propertyData.propertyName,
                            propertyData.unitCount,
                            propertyData.latitude,
                            propertyData.longitude,
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
                {isLoading ? <h1>Loading...</h1> : <FinanceComponent selectedProperty={selectedProperty} />}
            </div>
        </div>
    );
};

export default Page;