import {doc, getDoc} from "firebase/firestore";
import {db} from "@native/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchUserRole = async (uid: string) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data().role;
    } else {
        // docSnap.data() will be undefined in this case
        return "notFound";
    }
};

export const fetchUsername = async (uid: string) => {
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