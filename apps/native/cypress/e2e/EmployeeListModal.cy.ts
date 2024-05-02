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
            cy.get("[id=propertyManagementBtn]").click()
            cy.get(`[id=propertyTitle]`).contains("test property").first().click()
        });

        it("", () => {
            const testUserEmail = "eeeeeeeee2etestuser@gmail.com";

            cy.get("[id=viewEmployeesBtn]", {timeout:500}).click({force:true})
            cy.get("[id=addEmployeeBtn]", {timeout:500}).click({force:true})
            cy.wait(1000)
            cy.get("[id=emailSignUp]", {timeout:500}).type(testUserEmail)
            cy.get("[id=passwordSignUp]", {timeout:500}).type(testUserPassword)
            cy.get("[id=registerEmployeeBtn]").click()
        })
    })
}