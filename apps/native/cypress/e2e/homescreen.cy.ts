describe('My First Test', () => {
    it('Does not do much!', () => {
        //Example e2e test
      cy.visit("http://localhost:19006")
      cy.get("[id=description]").contains("Condo Vision is a comprehensive condo management system designed for the modern era. Our platform seamlessly integrates the needs of condo owners, rental users, and condo management companies, offering a streamlined and intuitive experience.")
    })
  })