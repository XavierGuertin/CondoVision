describe('Landing Page Tests', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    // Click on the login button
    it('.click() - Log In From Navbar', () => {
        cy.get(".loginButton").click();
        cy.url().should('include', '/login');
    });

    // Click on the mainButton button
    it('.click() - mainButton from main section', () => {
        cy.get("[name=mainButton]").click();
        cy.url().should('include', '/login');
    });

    // Click on the logo to make sure it loops back to the home page
    it('.click() - logo', () => {
        cy.get("[name=mainButton]").click();
        cy.get('[name=username]').url().should('include', '/login');
        cy.get(".logo").click();
        cy.url().should('include', '/');
    });
});