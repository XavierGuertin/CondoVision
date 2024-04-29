// processCondoUnits.ts
import CondoUnitAdapter from './CondoUnitAdapter';

//Function to intake condo units data from db and push to unitList
export function processCondoUnits(condoUnitsSnapshot: any) {
  const unitList: any[]=[];
  condoUnitsSnapshot.forEach((condoUnitDoc: any) => {
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

  return unitList;
}