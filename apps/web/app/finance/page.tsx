'use client';
import React, { useState } from "react";
import dynamic from 'next/dynamic';
import { useFetchData } from '../useFetchData';


import {
    PropertyListFinance,
    FinanceComponent,
} from "@ui/index";

const DashboardNav = dynamic(() => import('../../../../packages/ui/src/DashboardNav'), { ssr: false });

//Finance Page display... Uses useFetchData() function to obtain data on property, then loads dashboardnav, propertylistfinance and financecomponent
const Page: React.FC = ({ user, onClose }: any) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const { ownedProperties, selectedProperty, isLoading, setSelectedProperty } = useFetchData();


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