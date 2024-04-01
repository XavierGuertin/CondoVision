import React from 'react';
import {IoClose} from 'react-icons/io5'
import RequestBoxForManagement from './RequestBoxForManagement';

const RequestsModal = ({onClose}: any) => {

    return (
        <div
            className="fixed z-10 right-0 top-10 bottom-10  mt-20 w-1/4 max-sm:w-3/4 xs:w-3/4 sm:w-1/3 md:w-1/4 lg:w-1/5 bg-white p-6 overflow-auto rounded-lg shadow-xl transition-all duration-500 delay-200 transform translate-x-full ease-out transition-medium m-4 border-black border-2"
            style={{transform: 'translateX(0)', height: 'calc(85%)'}}>
            <div className="flex justify-end">
                <button onClick={onClose}
                        className="flex items-center justify-center bg-red-500 hover:bg-red-700 text-white font-bold rounded-full w-10 h-10">
                    <IoClose className="text-2xl"/>
                </button>
            </div>
            <div className="flex flex-col items-center">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4 mt-3">Requests Center</h2>
            </div>
            {<RequestBoxForManagement/>}
        </div>
    );
};

export default RequestsModal;