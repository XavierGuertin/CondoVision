const testUserEmail = "liam.daigle@gmail.com";
const testUserPassword= "password";
const condoId = "zBQ0iKOOCIiKouTDLwVW"

describe("FacilityBookingScreen tests", () =>{

    beforeEach(() => {
        cy.visit('/');
        cy.get("[id=homeBtn]").click()
        cy.get("[id=email]").type(testUserEmail, {force: true})
        cy.get("[id=password]").type(testUserPassword, {force: true})
        cy.get("[id=loginBtn]").click()
        cy.get("[id=propertyManagementBtn]").click()
    })

    it("Visit screen", () => {
        cy.get(`[id=propertyTitle]`).contains("TestingProperty").click()
        cy.get('div').contains("Book Facility").click({force:true})
        cy.get("div").contains("9:00").first().click()
        cy.get('div').contains("BOOK").click()
    })
})
