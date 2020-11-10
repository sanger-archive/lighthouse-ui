import axios from 'axios'
import plateBarcode from '@/modules/plate_barcode'
import config from '@/nuxt.config'

describe('PlateBarcode', () => {

  let mock, xml

  afterEach(() => {
    jest.resetAllMocks()
  })

  beforeEach(() => {
    mock = jest.spyOn(axios, 'post')
    xml = `<?xml version="1.0" encoding="UTF-8"?><plate_barcodes><barcode>702261</barcode></plate_barcodes>`
  })

  it('works', () => {
   expect(true).toBeTruthy()
  })

  describe('#extractBarcode', () => {
    it('when the barcode is 6 digits', () => {
      expect(plateBarcode.extractBarcode(xml)).toEqual('DN702261')
    })

    it('when the barcode is 7 digits', () => {
      xml = `<?xml version="1.0" encoding="UTF-8"?><plate_barcodes><barcode>7022617</barcode></plate_barcodes>`
      expect(plateBarcode.extractBarcode(xml)).toEqual('DN7022617')
    })

    it('when the xml is mashed up and there is no barcode', () => {
      xml = `<?xml version="1.0" encoding="UTF-8"?><plate_barcodes>this is a dodgy bit of xml</plate_barcodes>`
      expect(plateBarcode.extractBarcode(xml)).not.toBeDefined()
    })
  })

  describe('#createBarcode', () => {
    it('successfully', async() => {
      mock.mockResolvedValue({ data: xml})
      const response = await plateBarcode.createBarcode()
      expect(response.success).toBeTruthy()
      expect(response.barcode).toEqual('DN702261')
    })

    it('unsuccessfully', async() => {
      mock.mockImplementation(() =>
        Promise.reject(new Error('There was an error'))
      )
      const response = await plateBarcode.createBarcode()
      expect(response.success).toBeFalsy()
      expect(response.error).toEqual(new Error('There was an error'))
    })
  })

  describe('#createBarcodes', () => {

    describe('creating a single barcode', () => {

     
    })

    describe('creating multiple barcodes', () => {

      it('successfully', () => {

      })

      it('unsuccessfully - total failure', () => {

      })

      it('unsuccessfully - partial failure', () => {

      })

    })

  })

})