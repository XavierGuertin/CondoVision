import styles from "../styles/style";
import React from "react";
import Button from "./Button";
import Image from "next/image";
const MainSection = () => {
    return (
        <section id="home" className={`flex md:flex-row flex-col ${styles.paddingY}`}>
            <div className={`flex-1 ${styles.flexStart} z-5 flex-col xl:px-50 sm:px-16 px-6`}>
                <div className="flex flex-row items-center py-[6px] px-4 bg-discount-gradient rounded-[10px] mb-2">
                    <p className={`${styles.paragraph} ml-2`}>
                        <span className="text-white">CondoM</span>anagement at it&amp;s best
                    </p>
                </div>

                <div className="flex flex-row justify-between items-center w-full">
                    <h1 className="flex-1 font-poppins font-semibold ss:text-[72px] text-[52px] text-red-500 ss:leading-[100.8px] leading-[75px]">
                        <span className="text-gradient">Condo</span> <br className="sm:block hidden" />
                    </h1>
                </div>

                <h1 className="font-poppins font-semibold ss:text-[68px] text-[52px] text-white ss:leading-[100.8px] leading-[75px] w-full">
                    Vision.
                </h1>
                <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
                    Redefining the condo management experience with unmatched efficiency.
                    <br />Condo Vision is a comprehensive condo management system designed for the modern era
                </p>

                <Button styles={`mt-10`} />
            </div>

            <div className={`z-0 flex-1 flex ${styles.flexCenter} md:my-0 my-10 relative behind`}>
                <Image src="/abstract.png" alt="billing" width={1000} height={1000} className="relative z-[0] mr-[-50%] abstract"/>

                {/* gradient start */}
                <div className="absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient"/>
                <div className="absolute z-[1] w-[80%] h-[80%] rounded-full white__gradient bottom-40"/>
                <div className="absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient"/>
                {/* gradient end */}
            </div>
        </section>
    );
};

export default MainSection;