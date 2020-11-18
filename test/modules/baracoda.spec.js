import axios from 'axios'
import Baracoda from '@/modules/baracoda'

const errorResponse = new Error('There was an error')
const rejectPromise = () => Promise.reject(errorResponse)

describe('PlateBarcode', () => {
  let mock, barcodes

  afterEach(() => {
    jest.resetAllMocks()
    barcodes = ['HT-111116', 'HT-111117', 'HT-111118', 'HT-111119', 'HT-111120']
  })

  beforeEach(() => {
    mock = jest.spyOn(axios, 'post')
  })

  describe('#createBarcodes', () => {
    it('successfully', async () => {
      mock.mockResolvedValue({
        data: {
          barcodes_group: {
            barcodes,
            id: 3
          }
        }
      })
      const response = await Baracoda.createBarcodes(5)
      expect(response.success).toBeTruthy()
      expect(response.barcodes).toEqual(barcodes)
    })

    it('unsuccessfully', async () => {
      mock.mockImplementation(() => rejectPromise())
      const response = await Baracoda.createBarcodes(5)
      expect(response.success).toBeFalsy()
      expect(response.error).toEqual(errorResponse)
    })
  })
})
