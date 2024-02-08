describe('Sign In Using Existing Account', () => {
    const invalidEmail = `invalidEmail@email.com`; // Unique email for each test run
    const existingEmail = `admin@condovision.com`; // Email that already exists in the database
    const userPassword = 'admin123'; // password
    const invalidPassword = 'invalidPassword'; // Unique password for each test run


    beforeEach(() => {
        cy.visit('/login');
    });

    //Sign In Using Existing Account
    it('Sign In Using Existing Account', () => {
        cy.get('[name=emailSignIn]').type(existingEmail);
        cy.get('[name=passwordSignIn]').type(userPassword);
        cy.get('[name=submitSignIn]').click();
        cy.get('.SignInSuccess').contains('Success!');
    });

    //Sign In Using Non-Existing Email Account
    it('Sign In Using Non-Existing Account', () => {
        cy.get('[name=emailSignIn]').type(invalidEmail);
        cy.get('[name=passwordSignIn]').type(userPassword);
        cy.get('[name=submitSignIn]').click();
        cy.get('.SignInError').contains('Error!');
    });

    //Sign In Using Existing Email But Wrong Password
    it('Sign In Using Wrong Password', () => {
        cy.get('[name=emailSignIn]').type(existingEmail);
        cy.get('[name=passwordSignIn]').type(invalidPassword);
        cy.get('[name=submitSignIn]').click();
        cy.get('.SignInError').contains('Error!');
    });
});