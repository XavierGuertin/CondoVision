{
    const testUserEmail = "e2etestmapuser@gmail.com";
    const testUserPassword= "password";

    describe('Map Screen Test', () => {
        beforeEach(() => {
            cy.visit('/');
            cy.get("[id=homeBtn]").click()
            cy.get("[id=email]").type(testUserEmail, {force: true})
            cy.get("[id=password]").type(testUserPassword, {force: true})
            cy.get("[id=loginBtn]").click()
            cy.get("[id=propertyManagementBtn]").click()
        });
        it("", () =>{
            cy.get("[id=propertyView]").children().should('have.length', 1)
        })
        it("Overall Functionality", () => {
            cy.get("[id=mapBtn]").click()
            // Click x button
            cy.get("[id=goBackBtn]").click()

            cy.get("[id=mapBtn]").click()
            // Click existing pin
            cy.get("[id=pressablePin]").click()
        })
    })
}