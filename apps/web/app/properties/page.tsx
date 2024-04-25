"use client";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { db } from "@web/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useFetchData } from '@ui/useFetchData';

import {
  DashboardNav,
  PropertyList,
  PropertyComponent,
  CreatePropertyModal,
  CreateUnitModal,
  FacilityBookingPage,
} from "@ui/index";

const Page: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<Boolean>(false);
  /*** Used for creating the right amount of units and to pair them properly.*/
  const [propertyId, setPropertyId] = useState("");
  const [unitCount, setUnitCount] = useState(0);
  const [currentUnit, setCurrentUnit] = useState(0); // Start with 0 to not display
  const [showBookingModal, setShowBookingModal] = useState(false);
  const { ownedProperties, selectedProperty, isLoading, setSelectedProperty } = useFetchData();

  // Function to toggle the booking modal
  const toggleBookingModal = () => {
    setShowBookingModal(!showBookingModal);
  };
  const handlePropertySaved = async (
    propertyName: unknown,
    address: unknown
  ) => {
    const propertiesRef = collection(db, "properties");
    const q = query(
      propertiesRef,
      where("propertyName", "==", propertyName),
      where("address", "==", address)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setPropertyId(doc.id);
      setUnitCount(doc.data().unitCount);
      setCurrentUnit(1); // Start adding units after property is saved
    });
  };

  const handleUnitSaved = () => {
    if (currentUnit < unitCount) {
      setCurrentUnit(currentUnit + 1); // Prepare for next unit
    } else {
      alert("All units for this property have been added!");
      setIsModalOpen(false);
      window.location.reload();
    }
  };


  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-[#87A8FA] to-[#87CCFA] overflow-hidden">
      <DashboardNav />
      <div className="flex flex-grow overflow-hidden">
        {isLoading ? (
          <h1>Loading...</h1>
        ) : (
          <PropertyList
            ownedProperties={ownedProperties}
            setSelectedProperty={setSelectedProperty}
            setModalOpen={setIsModalOpen}
            isModalOpen={isModalOpen}
          />
        )}
        {!isLoading ? (
          <PropertyComponent
            selectedProperty={selectedProperty}
            onBookFacilityClick={toggleBookingModal}
            className="flex-grow overflow-y-auto"
          />
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
      {showBookingModal && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="my-modal"
        >
          <div className="relative top-20 mx-auto p-5 border w-3/4 shadow-lg rounded-md bg-blue-200">
            <FacilityBookingPage propertyId={selectedProperty?.id} />
            <button
              onClick={toggleBookingModal}
              className="absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-black text-sm z-50"
            >
              X
            </button>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div className="absolute top-0 h-screen w-screen bg-black bg-opacity-20">
          <div className="flex flex-col h-full items-center justify-center z-20">
            <div className="w-1/2 h-4/5 bg-blue-100 rounded-lg p-4 flex flex-col">
              {propertyId === "" ? (
                <>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="self-end flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full w-8 h-9"
                  >
                    <IoClose className="text-2xl" />
                  </button>
                  <CreatePropertyModal onPropertySaved={handlePropertySaved} />
                </>
              ) : currentUnit > 0 && currentUnit <= unitCount ? (
                <CreateUnitModal
                  propertyId={propertyId}
                  onUnitSaved={handleUnitSaved}
                />
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Page;
