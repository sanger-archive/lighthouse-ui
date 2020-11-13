import axios from 'axios'
import PlateBarcode from '@/modules/plate_barcode'

const errorResponse = new Error('There was an error')
const rejectPromise = () => Promise.reject(errorResponse)

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
      expect(PlateBarcode.extractBarcode(xml)).toEqual('DN702261')
    })

    it('when the barcode is 7 digits', () => {
      xml = `<?xml version="1.0" encoding="UTF-8"?><plate_barcodes><barcode>7022617</barcode></plate_barcodes>`
      expect(PlateBarcode.extractBarcode(xml)).toEqual('DN7022617')
    })

    it('when the xml is mashed up and there is no barcode', () => {
      xml = `<?xml version="1.0" encoding="UTF-8"?><plate_barcodes>this is a dodgy bit of xml</plate_barcodes>`
      expect(PlateBarcode.extractBarcode(xml)).not.toBeDefined()
    })
  })

  describe('#createBarcode', () => {
    it('successfully', async () => {
      mock.mockResolvedValue({ data: xml })
      const response = await PlateBarcode.createBarcode()
      expect(response.success).toBeTruthy()
      expect(response.barcode).toEqual('DN702261')
    })

    it('unsuccessfully', async () => {
      mock.mockImplementation(() => rejectPromise())
      const response = await PlateBarcode.createBarcode()
      expect(response.success).toBeFalsy()
      expect(response.error).toEqual(errorResponse)
    })
  })

  describe('#createBarcodes', () => {
    it('successfully', async () => {
      mock.mockResolvedValue({ data: xml })
      const barcodes = await PlateBarcode.createBarcodes(5)
      expect(barcodes).toEqual([
        'DN702261',
        'DN702261',
        'DN702261',
        'DN702261',
        'DN702261'
      ])
    })

    it('unsuccessfully - total failure', async () => {
      mock.mockImplementation(() => rejectPromise())
      await expect(PlateBarcode.createBarcodes(5)).rejects.toThrow(
        'Barcodes could not be created'
      )
    })

    it('unsuccessfully - partial failure', async () => {
      mock.mockResolvedValue({ data: xml })
      mock.mockImplementationOnce(() => rejectPromise())
      const barcodes = await PlateBarcode.createBarcodes(5)
      expect(barcodes).toEqual(['DN702261', 'DN702261', 'DN702261', 'DN702261'])
    })
  })
})
