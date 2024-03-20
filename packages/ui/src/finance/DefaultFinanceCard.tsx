import React from "react";

type Props = {
    url: string;
};

const DefaultFinanceCard = ({ url }: Props) => {

    return (
        <button className="w-[65vw] h-[20vh] rounded-lg bg-gray-500">
            <a href={url}></a>
        </button>
    );
};

export default DefaultFinanceCard;

