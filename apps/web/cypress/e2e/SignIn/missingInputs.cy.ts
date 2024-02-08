describe('Missing Inputs Tests Sign In', () => {
    const userEmail = `someEmail@email.com`; // Email that already exists in the database
    const userPassword = 'somePassword'; // password

    beforeEach(() => {
        cy.visit('/login');
    });


    // email missing error
    it('email missing', () => {
        cy.get('[name=passwordSignIn]').type(userPassword);
        cy.get('[name=submitSignIn]').click();
        cy.get('.SignInError').contains('Error!');
    });

    // password missing error
    it('password missing', () => {
        cy.get('[name=emailSignIn]').type(userEmail);
        cy.get('[name=submitSignIn]').click();
        cy.get('.SignInError').contains('Error!');
    });

    // email & password missing error
    it('password missing', () => {
        cy.get('[name=submitSignIn]').click();
        cy.get('.SignInError').contains('Error!');
    });
});