{
    const testUserEmail = "e2etestuser@gmail.com";
    const testUserPassword= "password";
    const testCMCEmail = "condomana@gmail.com"
    const testCMCPassword = "condo123"
    const property = "test property"
    describe('Property Management Page Tests', () => {
        beforeEach(() => {
            cy.visit('/');
            cy.get("[id=homeBtn]").click()
            
        })
    it("as user", () => {
        cy.get("[id=email]").type(testUserEmail, {force: true})
        cy.get("[id=password]").type(testUserPassword, {force: true})
        cy.get("[id=loginBtn]").click()
        cy.get("[id=notificationScreenBtn]").click()
        cy.get("div").contains("Make a Request").click()
        cy.get("[id=propertyTitle]").type(property)
    })
    it("as Condo Management Company accept with no response", () => {
        cy.get("[id=email]").type(testCMCEmail, {force: true})
        cy.get("[id=password]").type(testCMCPassword, {force: true})
        cy.get("[id=loginBtn]").click()
        cy.get("[id=notificationScreenBtn]").click()
        cy.get("div").contains("Request Center")
        cy.get("div").contains("Accept").click()
    })
    it("as Condo Management Company reject with no response", () => {
        cy.get("[id=email]").type(testCMCEmail, {force: true})
        cy.get("[id=password]").type(testCMCPassword, {force: true})
        cy.get("[id=loginBtn]").click()
        cy.get("[id=notificationScreenBtn]").click()
        cy.get("div").contains("Request Center")
        cy.get("div").contains("Reject").click()
    })
})
}