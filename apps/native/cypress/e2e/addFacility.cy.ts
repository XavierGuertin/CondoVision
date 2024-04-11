{
    const testUserEmail = "philcm@gmail.com";
    const testUserPassword= "123456";

    describe('Add Facility Modal Tests', () => {
        beforeEach(() => {
            cy.visit('/');
            cy.get("[id=homeBtn]").click()
            cy.get("[id=email]").type(testUserEmail, {force: true})
            cy.get("[id=password]").type(testUserPassword, {force: true})
            cy.get("[id=loginBtn]").click()
            cy.get("[id=propertyManagementBtn]").click()
            cy.get(`[id=propertyTitle]`).contains("Demo").click()
        });

        it("interact with 'Add Facilities' modal", () => {
            cy.get("[id=openFacilitiesModalBtn]").click()
            cy.get("[id=closeFacilitiesModalBtn]").click()
        })

        it("missing facility name generates proper alert", () =>{
            cy.get("[id=openFacilitiesModalBtn]").click()
            const stub = cy.stub()
            cy.on ('window:alert', stub)
            cy.get("[id=addFacilityBtn]").click()
            .then(() => {
                expect(stub.getCall(0)).to.be.calledWith('Invalid facility information!')
            })
        })
    })
}