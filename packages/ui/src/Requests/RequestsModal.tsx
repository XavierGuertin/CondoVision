/**
 * RequestsModal Component
 *
 * This component serves as a modal for handling various requests within a React application.
 * It primarily functions as a UI element that presents request-related information to the user,
 * allowing for an interactive and responsive design.
 *
 * Key Functionalities:
 * - Utilizes a modal design pattern to display requests information in a floating, focused UI element.
 * - Incorporates the `IoClose` icon from `react-icons` to provide a user-friendly mechanism to close the modal.
 * - Integrates with the `RequestBoxForManagement` sub-component to handle specific request-related functionalities.
 *
 * Styling:
 * - Applies Tailwind CSS for styling, ensuring a responsive and modern design across various device sizes.
 * - Uses fixed positioning, z-index, and overflow properties to ensure the modal is properly displayed and functional.
 *
 * Usage:
 * Include `<RequestsModal />` in your component tree and manage its visibility through state to incorporate a responsive requests handling modal in your application.
 */


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