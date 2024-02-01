import React, {useEffect, useState} from 'react';

// @ts-ignore
const Response = ({success, message}) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (message) {
            setShow(true);
            const timer = setTimeout(() => {
                setShow(false);
            }, 3000); // The message box will disappear after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [message]);

    if (!show) return null;

    return (
        <div className={`fixed top-0 inset-x-0 flex justify-center`}>
            <div
                className={`p-4 text-white ${success ? 'bg-green-500' : 'bg-red-500'}
                    rounded-md shadow-lg text-sm font-medium mt-4 transition-all`}
            >
                {message}
            </div>
        </div>
    );
};

export default Response;
