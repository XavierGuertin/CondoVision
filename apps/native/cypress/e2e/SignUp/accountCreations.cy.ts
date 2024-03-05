import {deleteUser, getAuth, onAuthStateChanged, connectAuthEmulator} from "firebase/auth";
import {deleteDoc, doc, getFirestore, connectFirestoreEmulator} from "firebase/firestore";
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

// Connect to Firestore and Auth emulators in development mode
// Firestore emulator
connectFirestoreEmulator(db, "127.0.0.1", 8080);
// Auth emulator
connectAuthEmulator(auth, "http://127.0.0.1:9099");

import admin from 'firebase-admin';

admin.initializeApp({
    projectId: "soen-390-capstone",
});
process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';

async function createTestUser() {
    try {
        await admin.auth().createUser({
            email: "admin@condovision.com",
            password: "admin123"
        });

        console.log('Test user created successfully');
    } catch (error) {
        console.error('Error creating test user:', error);
    }
}


function clearEmulatorData() {
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // Adjust the port number and project ID accordingly
    fetch('http://localhost:8080/emulator/v1/projects/soen-390-capstone/databases/(default)/documents', options)
        .then(response => response.json())
        .then(data => console.log('Firestore cleared:', data))
        .catch(error => console.error('Error clearing Firestore:', error));
}

describe('Account Creation Tests', () => {
    const userEmail = `testuser@test.com`; // Unique email for each test run
    const existingEmail = `admin@condovision.com`; // Email that already exists in the database
    const userPassword = 'testPassword'; // Unique password for each test run

    beforeEach(() => {
        cy.visit('/');
        cy.get("[id=logInButtonHome]").click();
        cy.get("[id=navigateToSignUp]").click();
    });

    before(() => {
        createTestUser();
    });

    //try to create an account with less than 6 characters in the password
    it('less than 6 characters password', () => {
        cy.get('[id=emailSignUp]').type(userEmail);
        cy.get('[id=passwordSignUp]').type("pass");
        cy.get('[id=createAccountButton]').click();
        cy.get('[id=SignUpError]').contains('Firestore: FirebaseError: Firebase: Password should be at least 6 characters (auth/weak-password).');
    });

    // try to create an account with valid inputs
    it('Create account with valid inputs', () => {
        cy.get('[id=emailSignUp]').type(userEmail);
        cy.get('[id=passwordSignUp]').type(userPassword);
        cy.get('[id=createAccountButton]').click();
    });

    // try to create an account with an already existing email
    it('Create account with existing email', () => {
        cy.get('[id=emailSignUp]').type(existingEmail);
        cy.get('[id=passwordSignUp]').type(userPassword);
        cy.get('[id=createAccountButton]').click();
        cy.get('[id=SignUpError]').contains('Firestore: FirebaseError: Firebase: Error (auth/email-already-in-use).');
    });
});
