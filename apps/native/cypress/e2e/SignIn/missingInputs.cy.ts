describe('Missing Inputs Tests Sign In', () => {
    const userEmail = `someEmail@email.com`; // Email that already exists in the database
    const userPassword = 'somePassword'; // password

    beforeEach(() => {
        cy.visit('/');
        cy.get("[id=logInButtonHome]").click();
        cy.get("[id=navigateToSignUp]").click();
    });


    // email missing error
    it('email missing', () => {
        cy.get('[id=password]').type(userPassword, {force: true});
        cy.get('[id=loginBtn]').click({force: true});
        cy.get('[id=SignInError]').contains('Error');
    });

    // password missing error
    it('password missing', () => {
        cy.get('[id=email]').type(userEmail,{force: true});
        cy.get('[id=loginBtn]').click({force: true});
        cy.get('[id=SignInError]').contains('Error');
    });

    // email & password missing error
    it('password missing', () => {
        cy.get('[id=loginBtn]').click({force: true});
        cy.get('[id=SignInError]').contains('Error');
    });
});