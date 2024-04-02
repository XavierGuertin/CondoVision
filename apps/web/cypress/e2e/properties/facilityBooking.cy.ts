
describe('Facility Booking Process', () => {
    beforeEach(() => {
        cy.visit('/login');

        cy.get('[name=emailSignIn]').type('ali@gmail.com');
        cy.get('[name=passwordSignIn]').type('12341234');
        cy.get('[name=submitSignIn]').click();
    });

    it('logs in and books a facility', () => {
        cy.visit('/dashboard');
        cy.visit('/properties');

        // Click the 'Book Facility' button
        cy.get('button').contains('Book Facility').click();

        // Interaction with the date picker to select April 2nd, 2024
        cy.get('.react-datepicker__input-container input').click();
        // Next month
        cy.get('.react-datepicker__navigation--next').click();
        // Day 2
        cy.get('.react-datepicker__day--002:not(.react-datepicker__day--outside-month)').click();

        //Expects alert and dismisses it
        cy.on('window:alert', (str) => {
            if (str === 'Time: 11:00 is selected!') {
                return true; // returning `true` will dismiss the alert
            }
        });

        cy.get('button').contains('11:00').click({force: true});

        //Expects alert and dismisses it
        cy.on('window:alert', (str) => {
            if (str === 'Booking successful!') {
                return true;
            }
        });

        cy.get('button').filter((index, element) => {
            // @ts-ignore
            return element.textContent.trim() === 'Book';
        }).click();

    });
});

