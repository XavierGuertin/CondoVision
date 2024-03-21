import {deleteUser, getAuth, onAuthStateChanged, connectAuthEmulator} from "firebase/auth";
import {deleteDoc, doc, getFirestore, connectFirestoreEmulator} from "firebase/firestore";
import {initializeApp} from "firebase/app";

const testUserEmail = "e2etestuser@gmail.com";
const testUserPassword= "password";

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

describe('Missing Inputs Tests Register Employee', () => {
    const userEmail = `lv2@test.com`; // Unique email for each test run
    const existingEmail = `admin@condovision.com`; // Email that already exists in the database
    const userPassword = 'testPassword'; // Unique password for each test run

    beforeEach(() => {
        cy.visit('/');
        cy.get("[id=homeBtn]").click();
        cy.get("[id=email]").type(testUserEmail, {force: true});
        cy.get("[id=password]").type(testUserPassword, {force: true});
        cy.get("[id=loginBtn]").click();
        cy.get("[id=propertyManagementBtn]").click();
        cy.get("[id=propertyView]").children().should('have.length', 1);
        cy.get("[id=propertyProfileComponentToggleBtn]").first().click();
        cy.get("[id=viewEmployeesBtn]").click();
        cy.get("[id=addEmployeeBtn]").click();
    });

    before(() => {
        createTestUser();
    });

    it("Register Employee with existing email", () => {

        // Register Employee
        cy.get("input[placeholder='email']").type(existingEmail, {force: true});
        cy.get("[data-testid=jobDropDownPicker]").click();
        cy.get("[data-testid=jobDropDownPicker]").click();
        cy.get("input[placeholder='password']").type(userPassword, {force: true});
        cy.get("[id=showPasswordBtn]").click();
        cy.get("[id=registerEmployeeBtn]").click();
    })
    it("less than 6 characters password", () => {

        // Register Employee
        cy.get("input[placeholder='email']").type(userEmail, {force: true});
        cy.get("input[placeholder='password']").type("Pass", {force: true});
        cy.get("[id=registerEmployeeBtn]").click();
        cy.get("[id=hideAddEmployeeModal]").click();
    })
});