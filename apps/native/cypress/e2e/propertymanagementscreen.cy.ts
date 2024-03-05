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
        });
        it("", () =>{
            cy.get("[id=propertyManagementBtn]").click()
            cy.get("[id=propertyView]").children().should('have.length', 1)
        })
    })
}