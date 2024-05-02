{
    const testUserEmail = "liam.daigle@gmail.com";
    const testUserPassword = "password";
    const testUnitId = "zBQ0iKOOCIiKouTDLwVW";

    describe('Condo Fee Calculation Screen Tests', () => {
        beforeEach(() => {
            cy.visit('/');
            cy.get("[id=homeBtn]").click()
            cy.get("[id=email]").type(testUserEmail, {force: true})
            cy.get("[id=password]").type(testUserPassword, {force: true})
            cy.get("[id=loginBtn]").should('be.visible').click()
            cy.get("[id=propertyManagementBtn]").click()
            cy.get(`[id=propertyTitle]`).contains("TestingProperty").click()
            cy.get(`[id=${testUnitId}]`).click()
            cy.get("[id=title]").contains(testUnitId)
        });

        it("visit condo fee calculation screen, then go back", () => {
            cy.get("[data-testid=feeCalculationBtn]").click({force:true})
            cy.get("[id=feeHeader]").contains("Monthly Fee Calculation")
            cy.get("[data-testid=feeCalculationBackBtn]").click()
        })
    })
}