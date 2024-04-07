import { db } from "@web/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";

type Props = {
  //   url: string;
  condo: object;
  property: object;
};

const DefaultFinanceCard = ({ /*url,*/ condo, property }: Props) => {
  const initialValue = [{}];

  const [payments, setPayments] = useState(initialValue);
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

      const paymentList: object[] = [];
      paymentDocs.forEach((paymentDoc) => {
        const data = paymentDoc.data();

        const paymentObject = {
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
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <h1 className="text-4xl">Financial Status:</h1>
          {condo.condoFees.isPayed ? (
            <label className="text-2xl text-green-600">Payed</label>
          ) : (
            <label className="text-2xl text-red-600">Not Payed</label>
          )}
          <label className="text-xl self-start">History:</label>

          {payments.length > 0 ? (
            payments.map((paymentObj) => (
              <div
                key={paymentObj.id}
                className="flex px-8 w-[65vw] flex-row justify-between"
              >
                <label>{secondsToDate(paymentObj.payment.date.seconds)}</label>
                {paymentObj.payment.isOnTime ? (
                  <label className="text-green-600">Paid</label>
                ) : (
                  <label className="text-red-600">Late</label>
                )}
              </div>
            ))
          ) : (
            <label>No history to show</label>
          )}
        </>
      )}
    </div>
  );
};

export default DefaultFinanceCard;
