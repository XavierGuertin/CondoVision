import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@web/firebase';
import CondoUnitAdapter from './../../native/components/CondoUnitAdapter';
import PropertyAdapter from './../../native/components/PropertyAdapter';


export const useFetchData = () => {
  const [ownedProperties, setOwnedProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const propertyList: any[] = [];
      try {
        const propertiesCollectionSnapshot = await getDocs(collection(db, 'properties'));

        propertiesCollectionSnapshot.forEach(async (propertyDoc) => {
          const unitList: any[] = [];
          const condoUnitsSnapshot = await getDocs(collection(db, 'properties', propertyDoc.id, 'condoUnits'));
          const userUID = await localStorage.getItem('userUID');
          let propertyData = propertyDoc.data();

          condoUnitsSnapshot.forEach((condoUnitDoc) => {
            const condoData = condoUnitDoc.data();
            const condoId = condoUnitDoc.id;

            const condoUnit = new CondoUnitAdapter(
              condoId,
              {
                includes: condoData?.condoFees?.includes,
                isPayed: condoData?.condoFees?.isPayed,
                monthlyFee: condoData?.condoFees?.monthlyFee,
              },
              condoData.lockerId,
              {
                contact: condoData?.occupantInfo?.contact,
                name: condoData?.occupantInfo?.name,
              },
              condoData.owner,
              condoData.parkingSpotId,
              condoData.size,
              condoData.unitId
            );
            unitList.push(condoUnit.toJSON());
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
        console.error('Error fetching data:', error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };

    fetchData();
  }, []);

  return { ownedProperties, selectedProperty, isLoading, setSelectedProperty };
};
