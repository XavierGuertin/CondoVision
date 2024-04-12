describe('Adding Employee Process', () => {
    beforeEach(() => {
        cy.visit('/login');

        cy.get('[name=emailSignIn]').type('ali@gmail.com');
        cy.get('[name=passwordSignIn]').type('12341234');
        cy.get('[name=submitSignIn]').click();

        cy.wait(1000);
    });

    // afterEach(() => {
    //     cy.visit('/');
    //     cy.wait(1000);
    //     cy.get('[name=signOutButton]').click();
    // });

    it('logs in and adds an employee', () => {
        cy.visit('/dashboard');
        cy.visit('/properties');

        cy.wait(5000);
        
        // Click the 'View Employees' button
        cy.contains('View Employees').click();
        
        // Wait for Employee List modal to be visible
        cy.get('.bg-opacity-50').should('be.visible');
        
        // Check if Employee List modal contains 'Add Employee' button
        cy.get('button').contains('Add Employee').should('be.visible').click();
        
        // Wait for Add Employee modal to be visible
        cy.get('.bg-opacity-50').should('be.visible');
        
        // Fill out Add Employee form
        cy.get('input[type="email"]').type('newemployee@gmail.com');
        cy.get('input[type="password"]').type('password');
        cy.get('select').select('Janitor');
        
        // Click 'Register Employee' button
        cy.contains('Register Employee').click();
        
        // Wait for success alert
        cy.on('window:alert', (str) => {
            if (str === 'Employee added successfully!') {
                return true; // returning `true` will dismiss the alert
            }
        });
        
        // Close Add Employee modal
        cy.get('button').contains('×').then(($btn) => {
            $btn[0].click(); // Access the native DOM element and click it
          });
        
        cy.contains('View Employees').click();
        // Check if the new employee is listed in the Employee List modal
        cy.get('li').contains('newemployee@gmail.com').should('be.visible');
    });
});