// GPL-558 As genomics POs (Emma, Rich C & James) we would like Lighthouse sentinel samples to be automatically created
// in sequencescape by scanning a BOX barcode to support a 5 day turn-around-time
// Scan in a Lighthouse BOX barcode
// Request the plate barcodes in to box from LabWhere (assumes box manifest has been uploaded previously see GPL-468)
// Request plate map metadata, root sample id, result (+ve, -ve or void)
// Request COG-UK id with correct prefix dependent on Lighthouse Lab (MILK, ALDP ...)
// Create (Just +ves?) sample in SS, including entery to stock_resourse table in MLWH (See GPL-577)
// Report back number plates, and samples created and if box barcode unknown, any plate barcodes unknown

describe('Lighthouse Sentinel Batch test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/sentinel_create_samples')
  })

  it('Visits the page', () => {
    cy.contains('Lighthouse Sentinel sample creation')
  })

  it('allows scanning of lighthouse box barcode', () => {
    cy.contains('Box barcode')
    cy.findByText('Please scan Lighthouse box barcode').type('DN1234567')
  })

  it('Scans lighthouse box barcode and displays results', () => {
    cy.contains('Box barcode')
    cy.findByText('Please scan Lighthouse box barcode').type('DN1234567')
    cy.findByText('Submit').click()
  })

  it('Allows selection of positives only or positives and negatives', () => {
    cy.get('[type="radio"]').first().check()
    // cy.get('[type="radio"]').last().check()
  })

  describe('creating some new samples', () => {
    beforeEach(() => {
      cy.findByText('Please scan Lighthouse box barcode').type('DN1234567')
      cy.findByText('Submit').click()
    })

    describe.skip('successfully', () => {
      it('displays correct number of records', () => {})

      it('displays plate id', () => {})

      it('displays plate barcode', () => {})

      it('displays the lighthouse', () => {})

      it('displays the available +ves count', () => {})

      it('displays the available -ves count', () => {})

      it('displays the available voids count', () => {})

      it('displays the created +ves count', () => {})

      it('displays the created -ves count', () => {})

      it('displays the created voids count', () => {})
    })

    describe.skip('unsuccessfully', () => {
      it('displays an appropriate error message', () => {})
    })
  })
})
