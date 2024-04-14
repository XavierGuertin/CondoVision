import { db } from "@web/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import './styles.css';

type Props = {
    property: {
      id: number;
    };
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
      reason: string;
    };
  };


  const PropertyFinanceCard = ({ property }: Props) => {
    const initialValue = [{}];
  
    const [payments, setPayments] = useState(Array<Payment>);
    const [loading, setLoading] = useState(true);
  
    const secondsToDate = (seconds: number) => {
      const date = new Date(seconds * 1000);
      const returnDate = date.toISOString();
      return returnDate.slice(0, returnDate.indexOf("T"));
    };
  
    const [balance, setBalance] = useState(0);

    useEffect(() => {
      const fetchData = async () => {
        // Fetch payments history
        const paymentsSnapshots = await getDocs(
          query(collection(db, "payments"), where("propertyId", "==", property.id)),
        );
  
        const paymentDocs = paymentsSnapshots.docs;
        console.log('Fetched documents:', paymentDocs);
  
        console.log(paymentDocs);
  
        const paymentList: Array<Payment> = [];
        let totalBalance = 0;
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
              reason: data.payment.reason,
            },
          };

          totalBalance += paymentObject.payment.amount;
  
          paymentList.push(paymentObject);
        });
        //let totalAmount = paymentList.reduce((total, paymentObj) => total + paymentObj.payment.amount, 0);
        //console.log("Total Amount: " + {totalAmount});
        setBalance(totalBalance);
        console.log(totalBalance);
        setPayments(paymentList);
      };
      fetchData();
  
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }, [property.id]);


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
            {(() => {
              let runningBalance = 0; //Create local variable for balance and initialize to 0, to not double everytime
              return payments.length > 0 ? (
                payments.map((paymentObj) => {
                  runningBalance += paymentObj.payment.amount;
                  return (
                    <tr key={paymentObj.id}>
                      <td>
                        {paymentObj.payment.amount > 0 ? 
                          <div className="bg-green-600">
                            <span className="font-bold">{paymentObj.payment.amount}</span> -{paymentObj.payment.reason} from Unit {paymentObj.condoId}
                          </div>
                          :
                          <div className="bg-red-600">
                            <span className="font-bold">{paymentObj.payment.amount}</span> -{paymentObj.payment.reason} from Unit {paymentObj.condoId}
                          </div>
                        }
                      </td>
                      <td>{runningBalance}</td>
                      <td>{secondsToDate(paymentObj.payment.date.seconds)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3}>No history to show</td>
                </tr>
              )
            })()}
          </tbody>
          </table>
        </div>
      );
    };
    
    export default PropertyFinanceCard;