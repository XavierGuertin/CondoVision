describe('Missing Inputs Tests Sign Up', () => {
    const userEmail = `testuser@test.com`; // Unique email for each test run
    const userPassword = 'testPassword'; // Unique password for each test run

    beforeEach(() => {
        cy.visit('/');
        cy.get("[id=logInButtonHome]").click();
        cy.get("[id=navigateToSignUp]").click();
    });

    // email missing error
    it('email missing', () => {
        cy.get('[id=passwordSignUp]').type(userPassword);
        cy.get('[id=createAccountButton]').click();
        cy.get('[id=SignUpError]').contains('Firestore: FirebaseError: Firebase: Error (auth/missing-email).');
    });

    // password missing error
    it('password missing', () => {
        cy.get('[id=emailSignUp]').type(userEmail);
        cy.get('[id=createAccountButton]').click();
        cy.get('[id=SignUpError]').contains('Firestore: FirebaseError: Firebase: Error (auth/missing-password).');
    });

    // email and password missing error
    it('password missing', () => {
        cy.get('[id=createAccountButton]').click();
        cy.get('[id=SignUpError]').contains('Firestore: FirebaseError: Firebase: Error (auth/invalid-email).');
    });
});