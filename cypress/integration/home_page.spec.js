describe('Index test', () => {
  it('Visits the Index', () => {
    cy.visit('http://localhost:3000/')
    cy.contains('Lighthouse positive samples reports')
  })
})
