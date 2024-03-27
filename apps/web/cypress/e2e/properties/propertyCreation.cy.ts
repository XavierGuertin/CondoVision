
describe('Create a property', () => {
    // /** email associated with a CONDO MANAGEMENT COMPANY */
    // const existingEmail = `condomana@gmail.com`;
    // const userPassword = `condo123`; // password

    // beforeEach(() => {
    //     cy.visit('/login');
    //     cy.get('[name=emailSignIn]').type(existingEmail);
    //     cy.get('[name=passwordSignIn]').type(userPassword);
    //     cy.get('[name=submitSignIn]').click();

    //     cy.window().then((win) => {
    //         win.localStorage.setItem('userRole', 'Condo Management Company');
    //         win.localStorage.setItem('userUID', 'Z0uOo7r0BQd4ZLIikiXc5nf6MNc2');
    //     });
    // });

    // // Check if the "Add Unit" button is visible
    // it('should display the "Add Property" button for Condo Management Company', () => {
    //     cy.visit('/properties')
    //     cy.get('div').contains('Add Property').should('be.visible');
    // });


    // it('should fill out the form after clicking "Add Property"', () => {
    //     cy.on('window:alert', (str) => {
    //         expect(str).to.equal(`Condo property saved successfully!`);
    //     });

    //     cy.visit('/properties');
    //     cy.get('div').contains('Add Property').click();

    //     // Fill out the form
    //     cy.get('input[placeholder="Enter Property Name"]').type('Test Property');
    //     cy.get('input[placeholder="Enter Address"]').type('123 Test Street');
    //     cy.get('input[value="1"]').type('1');

    //     // Submit the form
    //     cy.get('button[type="submit"]').click();
    // });

    // it('should fill out the unit form after clicking "Create Property"', () => {
    //     cy.on('window:alert', (str) => {
    //         expect(str).to.equal(`Condo property saved successfully!`);
    //     });

    //     cy.visit('/properties');
    //     cy.get('div').contains('Add Property').click();

    //     // Fill out the form
    //     cy.get('input[placeholder="Enter Property Name"]').type('Test Property');
    //     cy.get('input[placeholder="Enter Address"]').type('123 Test Street');
    //     cy.get('input[value="1"]').type('1');

    //     // Submit the form
    //     cy.get('button[type="submit"]').click();
    // });

    // it('should complete the property and its unit\' creation', () => {
    //     cy.visit('/properties');
    //     cy.get('div').contains('Add Property').click();

    //     // Fill out the form
    //     cy.get('input[placeholder="Enter Property Name"]').type('Test Property');
    //     cy.get('input[placeholder="Enter Address"]').type('123 Test Street');
    //     cy.get('input[value="1"]').type('1');

    //     // Submit the form
    //     cy.get('button[type="submit"]').click();

    //     // Fill out the form
    //     cy.get('input[placeholder="Enter Unit ID"]').type('1');
    //     cy.get('input[placeholder="Enter Unit Size"]').type('1000');
    //     cy.get('input[placeholder="Enter Monthly Condo Fees"]').type('500');

    //     // Submit the form
    //     cy.get('button[type="submit"]').click();
    // });
});
