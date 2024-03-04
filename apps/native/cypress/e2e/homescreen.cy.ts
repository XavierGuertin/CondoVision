describe('Landing Page Tests', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    // Click on the login button
    it('.click() - Log In From Navbar', () => {
        cy.get('.r-transitionProperty-1i6wzkk > .css-view-175oi2r').click();
        cy.url().should('include', '/login');
    });
});