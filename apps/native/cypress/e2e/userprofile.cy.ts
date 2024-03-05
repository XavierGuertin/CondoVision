{
    const testUserEmail = "e2etestuser@gmail.com";
    const testUserPassword= "password";
    const testUsername = "User"
    const testUserPhoneNumber = "514-514-5144"
    const testUserRole = "User"

    describe('User Profile Page Tests', () => {
        beforeEach(() => {
            cy.visit('/');
            cy.get("[id=homeBtn]").click()
            cy.get("[id=email]").type(testUserEmail, {force: true})
            cy.get("[id=password]").type(testUserPassword, {force: true})
            cy.get("[id=loginBtn]").click()
        });
        it("user profile loads", ()=>{
            cy.get("[id=userEmail]").contains(testUserEmail)
        })
        it("updates work correctly", ()=>{
            //Action
            const changedUsername = "TestUser";
            const changedPhoneNumber = "450-450-4500"
            cy.get("[data-testid=updateBtn]").click()
            cy.get("[id=usernameInput]").clear()
            cy.get("[id=usernameInput]").type(changedUsername, {force:true, delay:100})
            cy.get("[id=phoneNumberInput]").clear()
            cy.get("[id=phoneNumberInput]").type(changedPhoneNumber, {force:true, delay:100})
            cy.get("[data-testid=saveBtn]").click()
            //Assertion
            cy.get("[id=usernameText]").contains(changedUsername)
            cy.get("[id=userEmail]").contains(testUserEmail)
            cy.get("[id=phoneNumberText]").contains(changedPhoneNumber)
            cy.get("[id=roleText]").contains(testUserRole)
            //Clean Up
            profileCleanup()
        });
        it("user cancels editing profile and logs out", () => {
            cy.wait(500)
            cy.get('[data-testid=updateBtn]').click()
            cy.get('[data-testid=cancelBtn]').click()
            cy.get("[id=logoutBtn]").click({force:true})
        })
    });

    const profileCleanup = () => {
        cy.get("[data-testid=updateBtn]").click()
        cy.get("[id=usernameInput]").clear()
        cy.get("[id=usernameInput]").type(testUsername, {force:true, delay:100})
        cy.get("[id=phoneNumberInput]").clear()
        cy.get("[id=phoneNumberInput]").type(testUserPhoneNumber, {force:true, delay:100})
        cy.get("[data-testid=saveBtn]").click()
    }
}