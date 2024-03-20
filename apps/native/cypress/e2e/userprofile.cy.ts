{
    const testUserEmail = "e2etestuser@gmail.com";
    const testUserPassword= "password";
    const testUsername = "User"
    const testUserPhoneNumber = "514-514-5144"
    const testUserRole = "User"

    describe('User Profile Page Tests', () => {
        before(() => {
            profileCleanup()
        })
        beforeEach(() => {
            cy.visit('/');
            cy.get("[id=homeBtn]").click()
            cy.wait(2000)
            cy.get("[id=email]", {timeout:500}).type(testUserEmail, {force: true, delay:100})
            cy.get("[id=password]", {timeout:500}).type(testUserPassword, {force: true, delay:100})
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
            cy.wait(2000)
            cy.get("[id=usernameInput]").clear()
            cy.wait(2000)
            cy.get("[id=usernameInput]", {timeout:500}).type(changedUsername, {force:true, delay:100})
            cy.wait(2000)
            cy.get("[id=phoneNumberInput]").clear()
            cy.wait(2000)
            cy.get("[id=phoneNumberInput]", {timeout:500}).type(changedPhoneNumber, {force:true, delay:100})
            cy.get("[data-testid=saveBtn]").click()
            //Assertion
            cy.get("[id=usernameText]").contains(changedUsername)
            cy.get("[id=userEmail]").contains(testUserEmail)
            cy.get("[id=phoneNumberText]").contains(changedPhoneNumber)
            cy.get("[id=roleText]").contains(testUserRole)
        });
        it("user cancels editing profile and logs out", () => {
            cy.wait(2000)
            cy.get('[data-testid=updateBtn]').click()
            cy.get('[data-testid=cancelBtn]').click()
            cy.get('[id=logOutButton]').click({force:true})
        })
        afterEach(() => {
            profileCleanup()
        })
    });

    const profileCleanup = () => {
        cy.visit('/');
        cy.get("[id=homeBtn]", {timeout:500}).click()
        cy.get("[id=email]", {timeout:500}).type(testUserEmail, {force: true, delay:100})
        cy.get("[id=password]", {timeout:500}).type(testUserPassword, {force: true, delay:100})
        cy.get("[id=loginBtn]").click()

        cy.get("[data-testid=updateBtn]").click()
        cy.wait(2000)
        cy.get("[id=usernameInput]").clear()
        cy.wait(2000)
        cy.get("[id=usernameInput]", {timeout:500}).type(testUsername, {force:true, delay:100})
        cy.wait(2000)
        cy.get("[id=phoneNumberInput]").clear()
        cy.wait(2000)
        cy.get("[id=phoneNumberInput]", {timeout:500}).type(testUserPhoneNumber, {force:true, delay:100})
        cy.get("[data-testid=saveBtn]").click()
        cy.get('[id=logOutButton]').click({force:true})
    }
}