import React, {useEffect, useState} from 'react';
import {auth, db} from "@web/firebase";
import {collection, getDocs, updateDoc} from "firebase/firestore";
import { getDoc, doc } from "firebase/firestore";

// Request Box Component for Management
const RequestBoxForManagement = () => {
return (
    <div>
        {requests.map((request: any) => {
            return (
                <div key={request.id} className="notification-box ml-3">
                    <div className="content">
                        <p><strong>Title:</strong> {request.title}</p>
                        <p><strong>Message:</strong> {request.message}</p>
                        <p><strong>Property:</strong> {request.propertyName}</p>
                        <p><strong>Contact:</strong> {request.userEmail}</p>
                        <textarea value={responses[request.id] || ''} className="w-full border-2 pl-1" onChange={(e) => handleResponseChange(request.id, e.target.value)}
                                  placeholder=" Response"/>
                    </div>
                    <div className="button-container">
                        <button onClick={() => handleAccept(request.id, responses[request.id])} className="accept-button px-2 py-1">Accept
                        </button>
                        <button onClick={() => handleReject(request.id, responses[request.id])} className="reject-button px-2 py-1">Reject
                        </button>
                    </div>
                </div>
            );
        })}
    </div>
);
};

export default RequestBoxForManagement;