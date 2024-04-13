import React, { useState, useEffect } from 'react';

type Props = {
  condo: {
    id: number;
    condoFees: {
      includes: [];
      isPayed: boolean;
      monthlyFee: string;
    };
    lockerId: string;
    occupantInfo: {
      contact: string;
      name: string;
    };
    owner: string;
    parkingSpotId: string;
    size: string;
    unitId: string;
  };
  property: object;
};

type CondoFeeData = {
    unitSize: number;
    monthlyFeePerSize: number;
    parkingSpotCount: number;
    parkingFeePerSpot: number;
};

const DefaultCondoFeeCalcCard = ({ condo }: Props) => {
    const [condoData, setCondoData] = useState<CondoFeeData | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch condo data
    useEffect(() => {
        const fetchData = async () => {
            // Fetch condo data
            const data: CondoFeeData = {
                unitSize: Number(condo.size),
                monthlyFeePerSize: Number(condo.condoFees.monthlyFee),
                parkingSpotCount: condo.parkingSpotId ? 1 : 0,
                // TODO: fetch parking fee from newly created parkingFee field
                parkingFeePerSpot: 4,
            };
            setCondoData(data);
        };
        fetchData();
        
        setTimeout(() => {
            setLoading(false);
        }, 200);
    }, [condo]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!condoData) {
        return <div>No data available</div>;
    }

    // Calculate the total fees for convenience
    const totalCondoFee = condoData.unitSize * condoData.monthlyFeePerSize;
    const totalParkingFee = condoData.parkingSpotCount * condoData.parkingFeePerSpot;
    const totalMonthlyFee = totalCondoFee + totalParkingFee;

    return (
        <div className="flex flex-col items-center max-w-2/3 w-full sm:w-[65vw] md:max-w-1/2 lg:max-w-2/5 xl:max-w-1/3 rounded-lg bg-white px-4 py-4">
            <h1 className="text-2xl sm:text-4xl my-4">Condo Fee Calculation:</h1>
            <div className="w-full border-t pb-2 pt-4 mt-4">
                <Row label="Condo Dimensions (Ft²)" value={condoData.unitSize + " Ft²"} multiplier={condoData.monthlyFeePerSize + " $/Unit"} result={totalCondoFee}/>
                <Row label="Parking Spot Count" value={condoData.parkingSpotCount + " spot"} multiplier={condoData.parkingFeePerSpot + " $/Spot"} result={totalParkingFee} />
                <TotalRow label="Total Fees" result={totalMonthlyFee} />
            </div>
        </div>
    );
};

type RowProps = {
    label: string;
    value: string | number;
    multiplier: string | number;
    result: number;
  };

// Helper component for each row
const Row: React.FC<RowProps> = ({ label, value, multiplier, result}) => (
  <div className={`flex flex-wrap items-center justify-between mb-2`}>
    <div className="text-xl w-1/3 sm:w-auto mb-1 sm:mb-0">{label}:</div>
    <div className="flex items-center justify-center space-x-2 flex-grow mb-1 sm:mb-0">
      <span className="bg-blue-100 rounded px-2 py-1">{value}</span>
      <span className="text-xl">×</span>
      <span className="bg-blue-100 rounded px-2 py-1">{multiplier}</span>
    </div>
    <div className="bg-green-200 rounded px-2 py-1 font-semibold">= ${result}</div>
  </div>
);

type TotalRowProps = {
    label: string;
    result: number;
  };
  
// Helper component for the total row
const TotalRow: React.FC<TotalRowProps> = ({ label, result }) => (
    <div className="flex flex-wrap items-center justify-between border-t pt-4 mt-4 pb-2">
        <div className="text-xl font-bold w-full sm:w-auto mb-2 sm:mb-0">{label}:</div>
        <span className="font-bold bg-green-600 rounded px-2 py-1 text-white w-full sm:w-auto text-center sm:text-right">= ${result}</span>
    </div>
);

export default DefaultCondoFeeCalcCard;