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
        });
        it("", () =>{
            cy.get("[id=propertyView]").children().should('have.length', 1)
        })
        it("", () => {
            cy.get("[id=addPropertyBtnView]").children().click()
            //Property
            cy.get("input[placeholder='Enter Property Name']").type("test property", {force:true})
            cy.get("input[placeholder='Enter Unit Count']").type("1", {force:true})
            cy.get("input[placeholder='Enter Address']").type("123, Test Lane",{force:true})
            cy.get("[data-testid=savePropertyBtn]").click()
            //Condo
            cy.get("input[placeholder='Enter Unit ID']").type("QWOIPQWNVEOPWHIEG", {force:true})
            cy.get("input[placeholder='Enter Size']").type("100", {force:true})
            cy.get("input[placeholder='Enter Monthly Condo Fees']").type("500", {force:true})
            cy.get("[data-testid=saveCondoUnitBtn]").click()
        })
    })
}