import React from "react";

type Props = {
    url: string;
};

const DashboardCard = ({ url }: Props) => {

    return (
        <a className="w-[25vw] h-[30vh] rounded-lg bg-gray-500" href={url}>

        </a>
    );
};

export default DashboardCard;

