import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@web/firebase';
import {PropertyAdapter} from './PropertyAdapter';
import { processCondoUnits } from './processCondoUnits';

//Function returns owned properties data from db and sets properties
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
          const condoUnitsSnapshot = await getDocs(collection(db, 'properties', propertyDoc.id, 'condoUnits'));
          const userUID = await localStorage.getItem('userUID');
          let propertyData = propertyDoc.data();

          let unitList = processCondoUnits(condoUnitsSnapshot);

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
