'use client';
import {createUserWithEmailAndPassword} from "firebase/auth";
import React, {useState} from "react";
import {auth, db} from "../../firebase";
import Alert from "react-bootstrap/Alert";
import {doc, setDoc} from "firebase/firestore";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Customer");
    const [username, setUsername] = useState("");
    const [connectionStatus, setConnectionStatus] = useState("");
    const [errorMessage, setError] = useState("");

    const signUp = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                // Add the user's role and name to Firebase Firestore
                setDoc(doc(db, "users", user.uid), {
                    role: role,
                    email: email,
                    username: username
                })
                    .then(() => {
                        console.log("User data added to Firestore");
                        setConnectionStatus("success");
                    })
                    .catch((error) => {
                        console.error("Error adding user data to Firestore: ", error);
                        setConnectionStatus("error");
                        setError("Firestore: " + error)
                    });

                window.localStorage.setItem('userUID', userCredential.user.uid);
                window.localStorage.setItem('userRole', role);
                window.localStorage.setItem('username', username);

            })
            .catch((error) => {
                console.log(error);
                setConnectionStatus("error");
                setError(error.toString())
            });

    }
    return (
        <div className="sign-in-container w-full h-full font-poppins z-[20]">
            <form onSubmit={signUp}>
                <div className="bg-grey-lighter min-h-screen flex flex-col">
                    <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
                        <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
                            <h1 className="mb-8 text-3xl text-center">Sign up</h1>

                            {connectionStatus === "success" ?
                                <Alert variant="success">
                                    <Alert.Heading>
                                        <strong>Success! </strong> The account has been created.<br/>You are logged in
                                        successfully.<br/>
                                        You will be redirected to the main page.<br/><br/><br/>
                                    </Alert.Heading>
                                </Alert> : null}
                            {connectionStatus === "error" ?
                                <Alert variant="danger">
                                    <Alert.Heading>
                                        <strong>Error! </strong>{errorMessage}<br/><br/>
                                    </Alert.Heading>
                                </Alert> : null}
                            <input
                                type="text"
                                className="block border border-grey-light w-full p-3 rounded mb-4"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Name"
                                required={true}/>

                            <input
                                className="block border border-grey-light w-full p-3 rounded mb-4"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required={true}
                            />

                            <input
                                className="block border border-grey-light w-full p-3 rounded mb-4"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required={true}
                            />
                            <div>
                                <label>
                                    <select
                                        className="block border border-grey-light w-full p-3 rounded mb-4"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                    >
                                        <option defaultValue={"Customer"} value="Customer">Customer</option>
                                        <option value="Courier">Courier</option>
                                    </select>
                                </label>
                            </div>
                            <button
                                type="submit"
                                className="w-full text-center py-3 rounded bg-blue-gradient text-white focus:outline-none my-1"
                            >Create Account
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SignUp;

