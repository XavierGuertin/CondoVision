{
    const testUserEmail = "yasmine.hilout@gmail.com";
    const testUserPassword = "123456";
    const testUnitId = "JKupMQiPKUn4arGRTlEo";
    const testPropertyId = "WAdrY3hQAAbQVet07XOD";

    describe('Condo Fee Calculation Screen Tests', () => {
        beforeEach(() => {
            cy.visit('/');
            cy.get("[id=homeBtn]").click()
            cy.get("[id=email]").type(testUserEmail, {force: true})
            cy.get("[id=password]").type(testUserPassword, {force: true})
            cy.get("[id=loginBtn]").click()
            cy.get("[id=propertyManagementBtn]").click()
            cy.get(`[id=propertyTitle]`).contains("mybigPROPERTY").click()
            cy.get(`[id=${testUnitId}]`).click()
            cy.get("[id=title]").contains(testUnitId)
        });

        it("visit condo fee calculation screen, then go back", () => {
            cy.get("[data-testid=feeCalculationBtn]").click({force:true})
            cy.get("[id=condoFeeCalculationScreen]").contains("Condo Fee Calculation")
            cy.get("[data-testid=feeCalculationBackBtn]").click()
        })
    })
}