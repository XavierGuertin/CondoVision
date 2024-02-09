'use client';
import {signInWithEmailAndPassword} from "firebase/auth";
import React, {useState} from "react";
import {auth, db} from "@web/firebase";
import Alert from 'react-bootstrap/Alert';
import {doc, getDoc} from "firebase/firestore";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [connectionStatus, setConnectionStatus] = useState("");

    async function returnRole(uid : string) {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            return docSnap.data().role;
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
            return "notFound";
        }
    }

    async function returnUsername(uid : string) {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            return docSnap.data().username;
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
            return "notFound";
        }
    }


    const signIn = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                console.log(userCredential);
                window.localStorage.setItem('userUID', userCredential.user.uid);
                window.localStorage.setItem('userRole', await returnRole(userCredential.user.uid));
                window.localStorage.setItem('username', await returnUsername(userCredential.user.uid));
                setConnectionStatus("success");
            })
            .catch((error) => {
                console.log(error);
                // @ts-ignore
                setConnectionStatus("error");
            });
    };

    return (
        <div className="sign-in-container w-full h-max font-poppins z-[20]">
            <form onSubmit={signIn}>
                <div className="bg-grey-lighter min-h-screen flex flex-col">
                    <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
                        <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
                            <h1 className="mb-8 text-3xl text-center">Log in</h1>
                            {connectionStatus === "success" ?
                                <Alert variant="success">
                                    <Alert.Heading className={"SignInSuccess"}>
                                        <strong>Success! </strong>You are logged in successfully.<br/>
                                    </Alert.Heading>
                                </Alert> : null}
                            {connectionStatus === "error" ?
                                <Alert variant="danger">
                                    <Alert.Heading className={"SignInError"}>
                                        <strong>Error! </strong>Invalid email or password. Please try again.<br/>
                                    </Alert.Heading>
                                </Alert> : null}

                            <input
                                className="block border border-grey-light w-full p-3 rounded mb-4"
                                type="email"
                                name={"emailSignIn"}
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                className="block border border-grey-light w-full p-3 rounded mb-4"
                                type="password"
                                name={"passwordSignIn"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="submit"
                                name={"submitSignIn"}
                                className="w-full text-center py-3 rounded bg-blue-gradient text-white focus:outline-none my-1"
                            >Log In
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SignIn;