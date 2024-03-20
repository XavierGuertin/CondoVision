describe('Sign In Using Existing Account', () => {
    const invalidEmail = `invalidEmail@email.com`; // Unique email for each test run
    const existingEmail = `admin@condovision.com`; // Email that already exists in the database
    const userPassword = 'admin123'; // password
    const invalidPassword = 'invalidPassword'; // Unique password for each test run

    beforeEach(() => {
        cy.visit('/');
        cy.get("[id=logInButtonHome]").click();
    });

    //Sign In Using Existing Account
    it('Sign In Using Existing Account', () => {
        cy.get('[id=email]').type(existingEmail);
        cy.get('[id=password]').type(userPassword);
        cy.get('[id=showLoginPasswordBtn]').click();
        cy.get('[id=loginBtn]').click();
        cy.get('[id=userProfileLabel]').should('have.text', 'User Profile');
    });

    //Sign In Using Non-Existing Email Account
    it('Sign In Using Non-Existing Account', () => {
        cy.get('[id=email]').type(invalidEmail);
        cy.get('[id=password]').type(userPassword);
        cy.get('[id=loginBtn]').click();
        cy.get('[id=SignInError]').contains('Error');
    });

    //Sign In Using Existing Email But Wrong Password
    it('Sign In Using Wrong Password', () => {
        cy.get('[id=email]').type(existingEmail);
        cy.get('[id=password]').type(invalidPassword);
        cy.get('[id=loginBtn]').click();
        cy.get('[id=SignInError]').contains('Error');
        cy.get('[id=forgotPasswordBtn]').click();
        cy.get('[id=goBackHomeBtn]').click();
    });
});