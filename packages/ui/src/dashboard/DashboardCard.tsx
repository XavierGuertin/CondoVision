import Image from 'next/image'
import Link from 'next/link'
import React from 'react';

type Props = {
    url: string;
    imageUrl: any;
    name: string;
};

const DashboardCard = ({ url, imageUrl, name }: Props) => {
    return (
        <Link href={url}>
            <div className="w-[25vw] h-[30vh] rounded-lg relative">
                <Image src={imageUrl} alt={url} objectFit="contain" className='rounded-lg h-full absolute' />
                <h1 className="absolute inset-0 pl-2 flex justify-center items-center text-4xl capitalize text-white bg-black bg-opacity-40 rounded-lg hover:bg-opacity-70">{name}</h1>
            </div>
        </Link>
    );
};

export default DashboardCard;
