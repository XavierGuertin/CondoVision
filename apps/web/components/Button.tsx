'use client';
import React from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../firebase";

const Button = ({styles} : any) => {
    const [user] = useAuthState(auth);
    return (
        <button onClick={(e) => {
            e.preventDefault();
            window.location.href = (user ? '/quotation' : '/login');
        }}
                type="button"
                className={`quoteButton py-4 px-6 font-poppins font-medium text-[18px] text-primary bg-blue-gradient rounded-[10px] outline-none ${styles}`}>
            Get a Quote
        </button>
    );
};

export default Button;
