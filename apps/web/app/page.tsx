'use client'
import styles from "../styles/style";
import {MainSection, Navbar} from "../components/index";

const Page = () => (
    <div className="bg-primary w-full overflow-hidden">
        <div className={`${styles.paddingX} ${styles.flexCenter}`}>
            <div className={`${styles.boxWidth}`}>
                <Navbar/>
            </div>
        </div>

        <div className={`bg-primary ${styles.flexStart}`}>
            <div className={`${styles.boxWidth}`}>
                <MainSection/>
            </div>
        </div>
    </div>
);
export default Page;