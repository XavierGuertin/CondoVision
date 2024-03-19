import React, {useEffect, useState} from 'react';
import { IoClose } from 'react-icons/io5';
import { TbLogout2 } from "react-icons/tb";
import {auth, db, storage} from "@web/firebase";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import Image from "next/image";
import {signOut} from "firebase/auth";
import {SingleImageDropzone} from "./SingleImageDropzone";
import Response from "./Response";
import {Button} from "./button";

const UserProfileModal = ({ user, onClose }: any) => {

    const [userProfile, setUserProfile] = useState({
        email: '',
        username: '',
        role: '',
        phoneNumber: '',
        photoURL: '',
    });

    const [imageUrl, setImageUrl] = useState('/profilepicture.png');
    const [editMode, setEditMode] = useState(false);
    const [file, setFile] = useState<File>();
    const [newProfilePicture, setNewProfilePicture] = useState(false);
    const [responseMessage, setResponseMessage] = useState({success: false, message: ''});


    useEffect(() => {
        const fetchUserProfileAndAuthData = async () => {
            const user = auth.currentUser;
            if (user) {
                const {uid, email, displayName, phoneNumber, photoURL} = user;
                if (photoURL) {
                    setImageUrl(photoURL);
                } else {
                    const imageRef = ref(storage, `users/${uid}/profilePicture.jpg`);
                    try {
                        const url = await getDownloadURL(imageRef);
                        setImageUrl(url);
                    } catch (error) {
                        // @ts-ignore
                        if (error.code === 'storage/object-not-found') {
                            // Handle the case where the profile picture does not exist
                            setImageUrl('/profilepicture.png');
                        } else {
                            console.error("Error fetching profile picture: ", error);
                        }
                    }
                }

                const docRef = doc(db, "users", uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setUserProfile(prevState => ({
                        ...prevState,
                        email: userData.email || email,
                        username: userData.username || displayName,
                        role: userData.role,
                        phoneNumber: userData.phoneNumber || phoneNumber,
                        photoURL: userData.photoURL || photoURL,
                    }));
                } else {
                    console.log("No Firestore document for user!");
                    // @ts-ignore
                    setUserProfile(prevState => ({
                        ...prevState,
                        email: email,
                        username: displayName,
                        phoneNumber: phoneNumber,
                        photoURL: photoURL,
                    }));
                }
            }
        };

        fetchUserProfileAndAuthData();
    }, []);

    const handleUpdate = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const userUID = window.localStorage.getItem('userUID');
        if (userUID) {
            const userRef = doc(db, 'users', userUID);
            try {
                if (newProfilePicture) {
                    if (file) {
                        const storageRef = ref(storage, 'users/' + userUID + '/' + "profilePicture.jpg");
                        const uploadTask = uploadBytesResumable(storageRef, file);
                        uploadTask.on('state_changed',
                            (snapshot) => {
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
                            (error) => {
                                console.error("Error uploading profile picture: ", error);
                                setResponseMessage({success: false, message: "Failed to upload profile picture"});

                            },
                            () => {
                                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                                    setImageUrl(url);
                                    const userRef = doc(db, 'users', user.uid);
                                    updateDoc(userRef, { photoURL: url }).then(() => {
                                        console.log('Profile picture updated successfully');
                                        setResponseMessage({success: true, message: "Profile picture updated successfully"});
                                    }).catch((error) => {
                                        console.error("Error updating document: ", error);
                                        setResponseMessage({success: false, message: "Failed to update profile picture"});
                                    });
                                });
                            }
                        );
                    } else {
                        // Handle the case where file is undefined
                        console.error("No file selected for upload.");
                        setResponseMessage({success: false, message: "No file selected for upload."});
                    }
                }

                await updateDoc(userRef, userProfile);
                setResponseMessage({success: true, message: "Profile updated successfully"});
                setEditMode(false);
            } catch (error) {
                console.error("Error updating document: ", error);
                setResponseMessage({success: false, message: "Failed to update profile"});
            }
        }
    };

    const userSignOut = () => {
        signOut(auth)
            .then(() => {
                setResponseMessage({success: true, message: "Logged out successfully"});
                console.log("sign out successful");
                window.localStorage.setItem('userUID', "");
                window.localStorage.setItem('userRole', "");
                window.localStorage.setItem('username', "Portal");
                window.location.href = "/";
            })
            .catch((error) => console.log(error));
            setResponseMessage({success: false, message: "Failed to log out"});
    };

    return (
        <div
            className="fixed right-0 top-10 bottom-10 mt-20 w-1/4 max-sm:w-3/4 xs:w-3/4 sm:w-1/3 md:w-1/4 lg:w-1/5 bg-white p-6 overflow-auto rounded-lg shadow-xl transition-all duration-500 delay-200 transform translate-x-full ease-out transition-medium m-4 border-black border-2"
            style={{transform: 'translateX(0)', height: 'calc(85%)'}}>
            <div className="flex justify-between">
                <button onClick={userSignOut}
                        className="flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold w-24 h-10 rounded mr-4">
                    <TbLogout2 className="text-2xl"/>
                    <span>Log Out</span>
                </button>
                <button onClick={onClose}
                        className="flex items-center justify-center bg-red-500 hover:bg-red-700 text-white font-bold rounded-full w-10 h-10">
                    <IoClose className="text-2xl"/>
                </button>
            </div>
            <div className="flex flex-col items-center">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4 mt-3">User Profile</h2>

                {
                    editMode ?
                        <div style={{marginTop: 20}}>
                            <div className="text-center">
                                <b>Profile Picture</b>
                            </div>
                            <div className="px-14 mt-5 mb-5">
                                <SingleImageDropzone
                                    className={"profilePicture"}
                                    width={200}
                                    height={200}
                                    value={file}
                                    onChange={(file) => {
                                        setFile(file);
                                        setNewProfilePicture(true);
                                    }}
                                />
                            </div>
                        </div>
                        :
                        <Image
                            alt={"Profile Picture"}
                            src={imageUrl}
                            width={200}
                            height={200}
                            style={{borderRadius: 5, marginBottom: 20, aspectRatio: 1}}
                        />
                }
                <div className="space-y-2">
                    {editMode ? (
                        <>
                            <label><strong>Name: </strong></label>
                            <input type="text" value={userProfile.username}
                                   onChange={(e) => setUserProfile({...userProfile, username: e.target.value})}
                                   style={{
                                       padding: '10px',
                                       border: '1px solid black',
                                       marginBottom: '10px',
                                       width: '100%'
                                   }}/>
                            <br/>
                            <label><strong>Phone Number: </strong></label>
                            <input type="text" value={userProfile.phoneNumber}
                                   onChange={(e) => setUserProfile({...userProfile, phoneNumber: e.target.value})}
                                   style={{
                                       padding: '10px',
                                       border: '1px solid black',
                                       marginBottom: '10px',
                                       width: '100%'
                                   }}/>
                        </>
                    ) : (
                        <>
                            <p style={{fontSize:'1.2rem'}}>
                                <strong>Name: </strong> {userProfile.username}</p>
                            <p style={{fontSize: '1.2rem'}}>
                                <strong>Email: </strong> {userProfile.email}</p>
                            <p style={{fontSize: '1.2rem'}}>
                                <strong>Phone Number: </strong> {userProfile.phoneNumber}</p>
                            <p style={{fontSize: '1.2rem', marginBottom:20}}>
                                <strong>Role: </strong> {userProfile.role}</p>
                        </>
                    )}
                </div>
                {editMode ? (
                    <>
                        <Button onClick={handleUpdate} text={"Save Changes"}/>
                        <Button onClick={() => {
                            setEditMode(false);
                            setNewProfilePicture(false);
                        }} text={"Cancel"}/>
                    </>
                ) : (
                    <Button onClick={() => setEditMode(true)} text={"Edit Profile"}/>
                )}

                <Response success={responseMessage.success} message={responseMessage.message} />
            </div>
        </div>
    );
};

export default UserProfileModal;