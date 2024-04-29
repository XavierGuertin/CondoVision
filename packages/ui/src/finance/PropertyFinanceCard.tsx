import { db } from "@web/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import './styles.css';

type Props = {
    property: {
      id: number;
    };
    showFees: boolean;
    setShowFees: React.Dispatch<React.SetStateAction<boolean>>;
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

//Displays finance table, fetches payment data from payments db
  const PropertyFinanceCard = ({ property, showFees, setShowFees }: Props) => {
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
        setBalance(totalBalance);
        console.log(totalBalance);
        setPayments(paymentList);
      };
      fetchData();
  
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }, [property.id]);

      
    // Calculate the total sum of all positive payments (sum will only contain condo unit monthly fees, as payouts for work done are negative)
    let totalSum = payments.reduce((sum, paymentObj) => {
      if(paymentObj.payment.amount>0){
        return sum - paymentObj.payment.amount;
      }
      else{
        return sum;
      }
    },0);

      return (
        <div className="px-8 pb-1 flex flex-col items-center w-[65vw] min-h-[10vh] rounded-lg bg-white">
          <table id="financeTable">
            <thead>
              <tr>
                <th style={{width: '200px', wordWrap: 'break-word'}}>Income/Expenses</th>
                <th style={{width: '100px', wordWrap: 'break-word'}}>Balance</th>
                <th style={{width: '100px', wordWrap: 'break-word'}}>Date</th>
              </tr>
            </thead>
            <tbody>
            {(() => {
              // Start with the total sum of all payments
              let runningBalance = totalSum;
              
              /*Sorts according to date of payment. If payment is not on time, no money comes in or goes out, hence no change to balance. 
              Else it was paid fees / task work, money coming-in/going-out, affects balance*/
              return payments.length > 0 ? (
                payments.toSorted((a, b) => a.payment.date.seconds - b.payment.date.seconds).map((paymentObj, index, self) => {
                  if(paymentObj.payment.isOnTime == false){
                    runningBalance = runningBalance;
                  }
                  else{
                    runningBalance += paymentObj.payment.amount;
                  }
                  //If payment amount >0, check if payment is onTime, if false make transparent, if yes make green. If payment amount <0, make red 
                  return (
                    <tr key={paymentObj.id}>
                      <td>
                        {paymentObj.payment.amount > 0 ? (
                          paymentObj.payment.isOnTime == false ? (
                            <div>
                              <span className="font-bold">0$</span> -{paymentObj.payment.reason} from Unit {paymentObj.condoId}
                            </div>
                            ):(
                            <div className="bg-green-500">
                              <span className="font-bold">{paymentObj.payment.amount}$</span> -{paymentObj.payment.reason} from Unit {paymentObj.condoId}
                            </div>
                            )
                          ):(
                          <div className="bg-red-500">
                            <span className="font-bold">{paymentObj.payment.amount}$</span> -{paymentObj.payment.reason} from Unit {paymentObj.condoId}
                          </div>
                          )
                        }
                      </td>
                      <td>{index === self.length - 1 ? <b>{runningBalance}$</b> : <span>{runningBalance}$</span>}</td>
                      <td>{index === self.length - 1 ? <b>{secondsToDate(paymentObj.payment.date.seconds)}</b> : <span>{secondsToDate(paymentObj.payment.date.seconds)}</span>}</td>
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
          <button onClick={() => {
            setShowFees(!showFees);
          }}
          style={{
            backgroundColor: showFees ? 'lightblue' : 'initial',
            color: 'initial'
          }}
          onMouseOver={(e) => {
            (e.target as HTMLElement).style.color = 'blue';
          }}
          onMouseOut={(e) => {
            (e.target as HTMLElement).style.color = 'initial';
          }}
          >
            {showFees ? <div style={{marginTop: '20px'}}>Monthly Condo Fees: <span className="font-bold">{-totalSum}$</span> <br/> Yearly Condo Fees: <span className="font-bold">{-totalSum*12}$</span></div> : 'Show Fees'}
          </button>
        </div>
      );
    };
    
    export default PropertyFinanceCard;