describe('Landing Page Tests', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    // Click on the login button
    it('.click() - Log In From Navbar', () => {
        cy.get("[id=logInButtonHome]").click();
        cy.get("[id=loginLabel]").should('have.text', 'Login');
    });
});