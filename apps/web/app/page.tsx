'use client'
import styles from "../styles/style";
import {MainSection, Navbar} from "../components/index";
import {Footer} from "@/components";

const Page = () => (
    <div className="bg-primary w-full overflow-hidden">
        <div className={`${styles.paddingX} ${styles.flexCenter}`}>
            <div className={`${styles.boxWidth} front`}>
                <Navbar/>
            </div>
        </div>

        <div className={`bg-primary ${styles.flexStart}`}>
            <div className={`${styles.boxWidth}`}>
                <MainSection/>
            </div>
        </div>
        <br/><br/>
        <div className={`bg-primary ${styles.paddingX} ${styles.flexCenter}`}>
            <div className={`${styles.boxWidth} front`}>
                <Footer/>
            </div>
        </div>
    </div>
);
export default Page;