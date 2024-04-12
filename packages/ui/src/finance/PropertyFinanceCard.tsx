import { db } from "@web/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import './styles.css';

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


type Payment = {
    id: string;
    condoId: string;
    propertyId: string;
    payer: string;
    propertyOwner: string;
    payment: {
      date: {
        nanoseconds: number;
        seconds: number;
      };
      amount: number;
      isOnTime: boolean;
    };
  };

  const PropertyFinanceCard = ({ condo }: Props) => {
    const initialValue = [{}];
  
    const [payments, setPayments] = useState(Array<Payment>);
    const [loading, setLoading] = useState(true);
  
    const secondsToDate = (seconds: number) => {
      const date = new Date(seconds * 1000);
      const returnDate = date.toISOString();
      return returnDate.slice(0, returnDate.indexOf("T"));
    };
  
    useEffect(() => {
      const fetchData = async () => {
        // Fetch payments history
        const paymentsSnapshots = await getDocs(
          query(collection(db, "payments"), where("condoId", "==", condo.id)),
        );
  
        const paymentDocs = paymentsSnapshots.docs;
  
        console.log(paymentDocs);
  
        const paymentList: Array<Payment> = [];
        paymentDocs.forEach((paymentDoc) => {
          const data = paymentDoc.data();
  
          const paymentObject: Payment = {
            id: paymentDoc.id,
            condoId: data.condoId,
            propertyId: data.propertyId,
            payer: data.payer,
            propertyOwner: data.propertyOwner,
            payment: {
              date: data.payment.date,
              amount: data.payment.amount,
              isOnTime: data.payment.isOnTime,
            },
          };
  
          paymentList.push(paymentObject);
        });
        let totalAmount = paymentList.reduce((total, paymentObj) => total + paymentObj.payment.amount, 0);
        console.log("Total Amount: " + {totalAmount});
        console.log("Payments:");
        console.log(paymentList);
        setPayments(paymentList);
      };
      fetchData();
  
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }, []);


      return (
        <div className="px-8 flex flex-col items-center w-[65vw] h-[20vh] rounded-lg bg-white">
          <table id="financeTable">
            <thead>
              <tr>
                <th>Income/Expenses</th>
                <th>Balance</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              //Still need to properly add the 3 column data from properties
              {payments.length > 0 ? (
                payments.map((paymentObj) => (
                  <tr key={paymentObj.id} className="flex px-8 w-[65vw] flex-row justify-between">
                    <td>totalAmount</td>
                    <td></td>
                    <td>{secondsToDate(paymentObj.payment.date.seconds)}</td>
                  </tr>
                ))
              ):(
                <tr>
                  <td colSpan={3}>No history to show</td>
                </tr>
              )}
            </tbody>
          </table>
  </div>
      );
    };
    
    export default PropertyFinanceCard;