{    
    const testUserEmail = "liam.daigle@gmail.com";
    const testUserPassword= "password";
    const propertyId = "PdxHzIkMKJftpcvkWOSU"
    const condoId = "qjCDy6jib5Ff1hHOiUhL"

    describe('Condo Payment Fee Status and History Page Tests', () => {
        beforeEach(() => {
            cy.visit('/');
            cy.get("[id=homeBtn]").click()
            cy.get("[id=email]").type(testUserEmail, {force: true})
            cy.get("[id=password]").type(testUserPassword, {force: true})
            cy.get("[id=loginBtn]").click()
            cy.get("[id=propertyManagementBtn]").click()
            cy.get(`[id=propertyTitle]`).contains("The helma").click()
            cy.get(`[id=${condoId}]`).click()
            cy.get("[id=title]").contains(condoId)

        });

        it("visit condo payment fee status and history page, then go back", () => {
            cy.get("[data-testid=feeBtn]").click({force:true})
            cy.get("[id=status]").contains("Paid")
            cy.get("[data-testid=feeBackBtn]").click()
        })
    })
}