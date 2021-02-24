describe('Index test', () => {
  it('Visits the Index', () => {
    cy.visit('http://localhost:3000/reports')
    cy.contains('Lighthouse fit to pick samples reports')
  })
})
