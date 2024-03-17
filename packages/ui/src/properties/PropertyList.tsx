import { db } from "@web/firebase";
import { getDocs, collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import CondoUnitAdapter from "@native/components/CondoUnitAdapter"
import PropertyAdapter from "@native/components/PropertyAdapter";


const PropertyList = ({ user }: any) => {
    const [ownedProperties, setOwnedProperties] = useState<Object[]>([]);
    const [isLoading, setIsLoading] = useState<Boolean>(true);

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
                    var stopper = true;
                    var propertyData = propertyDoc.data();

                    condoUnitsSnapshot.forEach((condoUnitDoc) => {
                        var condoData = condoUnitDoc.data();
                        var condoId = condoUnitDoc.id;

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
        <div className="w-[25vw] h-[30vh] rounded-lg bg-gray-500">

        </div>
    );
};

export default PropertyList;

/*

  */