{    
    const testUserEmail = "liam.daigle@gmail.com";
    const testUserPassword= "password";
    const condoId = "qjCDy6jib5Ff1hHOiUhL"

    describe('Condo Unit Description Page Tests', () => {
        beforeEach(() => {
            cy.visit('/');
            cy.get("[id=homeBtn]").click()
            cy.get("[id=email]").type(testUserEmail, {force: true})
            cy.get("[id=password]").type(testUserPassword, {force: true})
            cy.get("[id=loginBtn]").click()
            cy.get("[id=propertyManagementBtn]").click()
            cy.get(`[id=propertyTitle]`).contains("The helma").click()
            cy.get(`[id=${condoId}]`).click()
        });

        it("visit condounitdescription page", () => {
            cy.get("[id=title]").contains(condoId)
            cy.get("[data-testid=backBtn]").click()
        })
    })
}