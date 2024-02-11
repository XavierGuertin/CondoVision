'use client';
import {createUserWithEmailAndPassword} from "firebase/auth";
import React, {useState} from "react";
import {auth, db, storage} from "@web/firebase";
import Alert from "react-bootstrap/Alert";
import {doc, setDoc} from "firebase/firestore";
import {getDownloadURL, ref, uploadBytesResumable, UploadTaskSnapshot} from "firebase/storage";
import {SingleImageDropzone} from "../index";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Customer");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [username, setUsername] = useState("");
    const [connectionStatus, setConnectionStatus] = useState("");
    const [errorMessage, setError] = useState("");
    const [file, setFile] = useState<File>();
    const [filePath, setFilePath] = useState("");

    const signUp = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (file) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;

                    // Store the user's profile picture in Firebase Storage
                    const storageRef = ref(storage, 'users/' + userCredential.user.uid + '/' + "profilePicture.jpg");
                    const  uploadTask = uploadBytesResumable(storageRef, file);

                    uploadTask.on('state_changed',
                        (snapshot: UploadTaskSnapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log('Upload is ' + progress + '% done');
                            switch (snapshot.state) {
                                case 'paused':
                                    console.log('Upload is paused');
                                    break;
                                case 'running':
                                    console.log('Upload is running');
                                    break;
                            }
                        },
                        (error: any) => {
                            console.log(error);
                        },
                        () => {
                            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                setFilePath(downloadURL);
                            });
                        }
                    );

                    // Add the user's role and name to Firebase Firestore
                    setDoc(doc(db, "users", user.uid), {
                        username: username,
                        email: email,
                        role: role,
                        phoneNumber: phoneNumber,
                        profilePicture: filePath

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
                                    <Alert.Heading className={"successSignUp"}>
                                        <strong>Success! </strong> The account has been created.<br/>You are logged in
                                        successfully.<br/>
                                    </Alert.Heading>
                                </Alert> : null}
                            {connectionStatus === "error" ?
                                <Alert variant="danger">
                                    <Alert.Heading className={"SignUpError"}>
                                        <strong>Error! </strong>{errorMessage}<br/><br/>
                                    </Alert.Heading>
                                </Alert> : null}


                            {/*Upload Image code section*/}
                            <div>
                                <p>Profile Picture</p>
                                <div className="px-14">
                                    <SingleImageDropzone
                                        className={"profilePicture"}
                                        width={200}
                                        height={200}
                                        value={file}
                                        onChange={(file) => {
                                            setFile(file);
                                        }}
                                    />
                                </div>
                            </div>
                            {/*End of Upload Image code section*/}
                            {
                                file ? null :
                                    <div>
                                        <p className="text-red-600 font-extrabold missingProfilePicture">* Profile Picture is required *</p>
                                    </div>
                            }

                            <br/>
                            <input
                                type="text"
                                name={"username"}
                                className="block border border-grey-light w-full p-3 rounded mb-4"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Name"
                                required={true}/>

                            <input
                                className="block border border-grey-light w-full p-3 rounded mb-4"
                                type="email"
                                name={"email"}
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required={true}
                            />

                            <input
                                type="text"
                                className="block border border-grey-light w-full p-3 rounded mb-4"
                                value={phoneNumber}
                                name={"phoneNumber"}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Phone Number"
                                required={true}/>

                            <input
                                className="block border border-grey-light w-full p-3 rounded mb-4"
                                type="password"
                                name={"password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required={true}
                            />
                            <div>
                                <label>
                                    <select
                                        className="block border border-grey-light w-full p-3 rounded mb-4"
                                        name={"role"}
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                    >
                                        <option defaultValue={"User"} value="User">User</option>
                                        <option value="Condo Management Company">Condo Management Company</option>
                                    </select>
                                </label>
                            </div>
                            <button
                                type="submit"
                                name={"createAccountButton"}
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

