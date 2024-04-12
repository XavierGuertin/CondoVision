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
        <div className="px-8 flex flex-col items-center w-[65vw] h-[20vh] rounded-lg bg-white">
            <h1 className="text-4xl mb-4">Condo Fee Calculation:</h1>
            <div className="flex flex-col space-y-4 w-full">
                <Row label="Condo Dimensions (Ft²)" value={condoData.unitSize + " Ft²"} multiplier={condoData.monthlyFeePerSize + " $/Unit"} result={totalCondoFee} />
                <Row label="Parking Spot Count" value={condoData.parkingSpotCount} multiplier={condoData.parkingFeePerSpot + " $/Spot"} result={totalParkingFee} />
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
const Row: React.FC<RowProps> = ({ label, value, multiplier, result }) => (
    <div className="flex items-center justify-between">
      <div className="font-semibold">{label}:</div>
      <div className="flex items-center space-x-2">
        <span>{value}</span>
        <span>×</span>
        <span>{multiplier}</span>
      </div>
      <div className="font-semibold">= ${result}</div>
    </div>
);

type TotalRowProps = {
    label: string;
    result: number;
  };
  
// Helper component for the total row
const TotalRow: React.FC<TotalRowProps> = ({ label, result }) => (
    <div className="flex items-center justify-between pt-4 border-t">
        <div className="font-bold">{label}:</div>
        <div className="font-bold">${result}</div>
    </div>
);

export default DefaultCondoFeeCalcCard;