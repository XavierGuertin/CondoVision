describe('Missing Inputs Tests Sign Up', () => {
    const userName = 'testUser'; // Unique username for each test run
    const userEmail = `testuser@test.com`; // Unique email for each test run
    const userPhoneNumber = '1234567890'; // Unique phone number for each test run
    const userPassword = 'testPassword'; // Unique password for each test run
    const filePath = './public/ProfilePicture.jpg'; // Path to the profile picture

    beforeEach(() => {
        cy.visit('/login');
    });

    // profile picture missing error
    it('profile picture missing', () => {
        cy.get('[name=username]').type(userName);
        cy.get('[name=email]').type(userEmail);
        cy.get('[name=phoneNumber]').type(userPhoneNumber);
        cy.get('[name=password]').type(userPassword);
        cy.get('[name=role]').select('Condo Management Company');
        cy.get('[name=createAccountButton]').click();
        cy.get('.missingProfilePicture').should('have.text', '* Profile Picture is required *');
    });

    // username missing error
    it('username missing', () => {
        cy.get('input[type="file"]').selectFile(filePath, {force: true});
        cy.get('[name=email]').type(userEmail);
        cy.get('[name=phoneNumber]').type(userPhoneNumber);
        cy.get('[name=password]').type(userPassword);
        cy.get('[name=role]').select('Condo Management Company');
        cy.get('[name=createAccountButton]').click();

        cy.get('[name=username]').then(($input) => {
            // This assertion checks if the input has the ':invalid' pseudo-class, implying it would show the validation message
            const inputElement = $input[0] as HTMLInputElement;

            // Assert on the validationMessage property
            expect(inputElement.validationMessage).to.eq('Please fill out this field.');
        });
    });

    // email missing error
    it('email missing', () => {
        cy.get('input[type="file"]').selectFile(filePath, {force: true});
        cy.get('[name=username]').type(userName);
        cy.get('[name=phoneNumber]').type(userPhoneNumber);
        cy.get('[name=password]').type(userPassword);
        cy.get('[name=role]').select('Condo Management Company');
        cy.get('[name=createAccountButton]').click();

        cy.get('[name=email]').then(($input) => {
            // This assertion checks if the input has the ':invalid' pseudo-class, implying it would show the validation message
            const inputElement = $input[0] as HTMLInputElement;

            // Assert on the validationMessage property
            expect(inputElement.validationMessage).to.eq('Please fill out this field.');
        });
    });

    // phone number missing error
    it('phone number missing', () => {
        cy.get('input[type="file"]').selectFile(filePath, {force: true});
        cy.get('[name=username]').type(userName);
        cy.get('[name=email]').type(userEmail);
        cy.get('[name=password]').type(userPassword);
        cy.get('[name=role]').select('Condo Management Company');
        cy.get('[name=createAccountButton]').click();

        cy.get('[name=phoneNumber]').then(($input) => {
            // This assertion checks if the input has the ':invalid' pseudo-class, implying it would show the validation message
            const inputElement = $input[0] as HTMLInputElement;

            // Assert on the validationMessage property
            expect(inputElement.validationMessage).to.eq('Please fill out this field.');
        });
    });

    // password missing error
    it('password missing', () => {
        cy.get('input[type="file"]').selectFile(filePath, {force: true});
        cy.get('[name=username]').type(userName);
        cy.get('[name=email]').type(userEmail);
        cy.get('[name=phoneNumber]').type(userPhoneNumber);
        cy.get('[name=role]').select('Condo Management Company');
        cy.get('[name=createAccountButton]').click();

        cy.get('[name=password]').then(($input) => {
            // This assertion checks if the input has the ':invalid' pseudo-class, implying it would show the validation message
            const inputElement = $input[0] as HTMLInputElement;

            // Assert on the validationMessage property
            expect(inputElement.validationMessage).to.eq('Please fill out this field.');
        });
    });

    // role default value
    it('role default value', () => {
        cy.get('[name=role] option:selected').should('have.text', 'User');
    });
});