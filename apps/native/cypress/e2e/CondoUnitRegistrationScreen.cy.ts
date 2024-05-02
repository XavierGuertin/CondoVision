{
    const testUserEmail = "e2etestuser@gmail.com";
    const testUserPassword= "password";

    describe('Property Management Page Tests', () => {
        beforeEach(() => {
            cy.visit('/');
            cy.get("[id=homeBtn]").click()
            cy.get("[id=email]").type(testUserEmail, {force: true})
            cy.get("[id=password]").type(testUserPassword, {force: true})
            cy.get("[id=loginBtn]").click()
            cy.get("[data-testid=settings]").click()
        });

        it("Test clicking submit with no values, then with values", () => {
            cy.get("div").contains("Register Condo Unit").click()
            cy.get("[data-testid=registrationInput]").type("TestRegistration")
            cy.get("div").contains("Register Condo Unit").click()
        })
    })
}