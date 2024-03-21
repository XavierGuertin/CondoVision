const testUserEmail = "lv@testowner.com";
const testUserPassword= "password";
const testEmployeeEmail = "lv@testemployee.com";
const testEmployeeJob = "Custodian";

describe('User Profile Page Tests', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.get("[id=homeBtn]").click();
        cy.get("[id=email]").type(testUserEmail, {force: true});
        cy.get("[id=password]").type(testUserPassword, {force: true});
        cy.get("[id=loginBtn]").click();
        cy.get("[id=propertyManagementBtn]").click();
        cy.get("[id=propertyView]").children().should('have.length', 1);
        cy.get("[id=propertyProfileComponentToggleBtn]").first().click();
        cy.get("[id=viewEmployeesBtn]").click();
        cy.get("[id=employeeList]").children().should('have.length', 1);
    });
    it("Check Employee Info", ()=>{
        // Check existing employee info
        cy.get("[id=employeeEmail]").contains(testEmployeeEmail);
        cy.get("[id=employeeJob]").contains(testEmployeeJob);
        cy.get("[id=hideEmployeeListModal]").click();
    });
});