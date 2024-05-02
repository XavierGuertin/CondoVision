{

    const testCMCEmail = "condomana@gmail.com"
    const testCMCPassword = "condo123"
    describe("", () => {
        beforeEach(() => {
            cy.visit('/');
            cy.get("[id=homeBtn]").click()
            cy.get("[id=email]").type(testCMCEmail, {force: true})
            cy.get("[id=password]").type(testCMCPassword, {force: true})
            cy.get("[id=loginBtn]").click()
        })

        it("", () => {
            cy.get("[id=reportBtn]").click()
            cy.get("div").contains("Wn9wNX8My8RBDIQEcncY")
        })
    })
}