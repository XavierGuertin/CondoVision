import {deleteUser, getAuth, onAuthStateChanged} from "firebase/auth";
import {deleteDoc, doc, getFirestore} from "firebase/firestore";
import {initializeApp} from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyA0dkvX3tb390kt_2aj8OTNaF60KRQY4jk",
    authDomain: "soen-390-capstone.firebaseapp.com",
    projectId: "soen-390-capstone",
    storageBucket: "soen-390-capstone.appspot.com",
    messagingSenderId: "238400176061",
    appId: "1:238400176061:web:2898be7e39485fe9599cd4",
    measurementId: "G-NLVQRZC99Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
describe('Account Creation Tests', () => {
    const userName = 'testUser'; // Unique username for each test run
    const userEmail = `testuser@test.com`; // Unique email for each test run
    const existingEmail = `admin@condovision.com`; // Email that already exists in the database
    const userPhoneNumber = '1234567890'; // Unique phone number for each test run
    const userPassword = 'testPassword'; // Unique password for each test run
    const filePath = './public/ProfilePicture.jpg'; // Path to the profile picture

    beforeEach(() => {
        cy.visit('/login');
    });

    //try to create an account with less than 6 characters in the password
    it('less than 6 characters password', () => {
        cy.get('input[type="file"]').selectFile(filePath, {force: true});
        cy.get('[name=username]').type(userName);
        cy.get('[name=email]').type(userEmail);
        cy.get('[name=phoneNumber]').type(userPhoneNumber);
        cy.get('[name=password]').type("pass");
        cy.get('[name=createAccountButton]').click();
        cy.get('.SignUpError').contains('Error! FirebaseError: Firebase: Password should be at least 6 characters (auth/weak-password).');
    });

    // try to create an account with valid inputs
    it('Create account with valid inputs', () => {
        cy.get('input[type="file"]').selectFile(filePath, {force: true});
        cy.get('[name=username]').type(userName);
        cy.get('[name=email]').type(userEmail);
        cy.get('[name=phoneNumber]').type(userPhoneNumber);
        cy.get('[name=password]').type(userPassword);
        cy.get('[name=createAccountButton]').click();
        cy.get('.successSignUp').contains('Success!');
        deleteUserFromFirebase();

        cy.get('[name=signOutButton]').click();
    });

    // try to create an account with an already existing email
    it('Create account with existing email', () => {
        cy.get('input[type="file"]').selectFile(filePath, {force: true});
        cy.get('[name=username]').type(userName);
        cy.get('[name=email]').type(existingEmail);
        cy.get('[name=phoneNumber]').type(userPhoneNumber);
        cy.get('[name=password]').type(userPassword);
        cy.get('[name=createAccountButton]').click();
        cy.get('.SignUpError').contains('FirebaseError: Firebase: Error (auth/email-already-in-use).');
    });

    function deleteUserFromFirebase() {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                deleteUser(user).then(() => {
                    console.log('User deleted successfully.');
                    deleteDoc(doc(db, "users", user.uid))
                        .then(() => {
                            console.log('User doc deleted successfully.');
                        }).catch((error) => {
                        console.error('Error deleting user doc:', error);
                    });
                }).catch((error: any) => {
                    console.error('Error deleting user:', error);
                });
            } else {
                console.log('No user to delete.');
                // Handle the case when there is no user signed in
            }
        });
    }
});
