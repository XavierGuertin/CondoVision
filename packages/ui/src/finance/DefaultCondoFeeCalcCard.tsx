import React, { useState, useEffect } from 'react';
import { db } from '@web/firebase';
import { doc, getDoc } from 'firebase/firestore';

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

    //styles
    const style = {
        condoFeeCard: {
            width: '90%',
            margin: 'auto',
            padding: '20px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        },
        feeDetail: {
            margin: '10px 0',
            fontSize: '16px'
        },
        loading: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }
    };

    // Fetch condo data
    useEffect(() => {
        const fetchData = async () => {
        // Fetch condo data
        const data: CondoFeeData = {
            unitSize: Number(condo.size),
            monthlyFeePerSize: Number(condo.condoFees.monthlyFee),
            parkingSpotCount: (condo.parkingSpotId ? 1 : 0),
            // TODO: fetch parking fee from newly created parkingFee field
            parkingFeePerSpot: 4,
        };
        setCondoData(data);
        };
        fetchData()
        
        setTimeout(() => {
            setLoading(false);
          }, 200);
    }, []);

    if (loading) {
        return <div style={style.loading}>Loading...</div>;
    }

    if (!condoData) {
        return <div>No data available</div>;
    }

    return (
        <div className="px-8 flex flex-col items-center w-[65vw] h-[20vh] rounded-lg bg-white">
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <>
        <div style={style.condoFeeCard}>
            <h2>Condo Fee Details</h2>
            {/* Condo Fee Details */}
            <div style={style.feeDetail}>
                <strong>Condo Dimensions (sq.ft.): </strong>
                <span>{condoData.unitSize}</span>
            </div>
            <div style={style.feeDetail}>
                <strong>Monthly Condo Fee ($/sq.ft.): </strong>
                <span>{condoData.monthlyFeePerSize}</span>
            </div>
            <div style={style.feeDetail}>
                <strong>Total Condo Fee: </strong>
                <span>${condoData.unitSize * condoData.monthlyFeePerSize}</span>
            </div>
            {/* Parking Fee Details */}
            <div style={style.feeDetail}>
                <strong>Condo Dimensions (sq.ft.): </strong>
                <span>{condoData.parkingSpotCount}</span>
            </div>
            <div style={style.feeDetail}>
                <strong>Monthly Condo Fee ($/sq.ft.): </strong>
                <span>{condoData.parkingFeePerSpot}</span>
            </div>
            <div style={style.feeDetail}>
                <strong>Total Parking Fee: </strong>
                <span>${condoData.parkingSpotCount * condoData.parkingFeePerSpot}</span>
            </div>

            {/* Total Monthly Fee */}
            <div style={style.feeDetail}>
                <strong>Total Parking Fee: </strong>
                <span>${}</span>
            </div>

        </div>
        </>
      )}
    </div>
    );
};

export default DefaultCondoFeeCalcCard;