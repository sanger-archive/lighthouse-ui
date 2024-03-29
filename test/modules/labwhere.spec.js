import axios from 'axios'
import PlatesJson from '../data/labwhere_plates'
import labwhere from '@/modules/labwhere'

describe('Labwhere', () => {
  describe('#getPlatesFromBoxBarcodes', () => {
    let boxBarcodes, response, mockGet, mockResponse

    beforeEach(() => {
      mockGet = jest.spyOn(axios, 'get')
      boxBarcodes = ['lw-ogilvie-4', 'lw-ogilvie-5']
    })

    afterEach(() => {
      mockGet.mockRestore()
    })

    it('successfully', async () => {
      mockResponse = { data: PlatesJson }
      mockGet.mockResolvedValue(mockResponse)

      response = await labwhere.getPlatesFromBoxBarcodes(boxBarcodes)
      expect(response.success).toBeTruthy()
      expect(response.barcodes).toEqual(['AB123', 'CD456'])
    })

    it('when there is an error', async () => {
      mockGet.mockImplementationOnce(() => Promise.reject(new Error('There was an error')))
      response = await labwhere.getPlatesFromBoxBarcodes(boxBarcodes)
      expect(response.success).toBeFalsy()
      expect(response.barcodes).toBeUndefined()
    })

    // This is the same as the above but worth adding for consistency
    it('when the box does not exist', async () => {
      mockGet.mockImplementationOnce(() => Promise.reject(new Error('There was an error')))
      response = await labwhere.getPlatesFromBoxBarcodes(['dodgybarcode'])
      expect(response.success).toBeFalsy()
      expect(response.barcodes).toBeUndefined()
      expect(response.error).toEqual(new Error('There was an error'))
    })

    it('when the box has no plates', async () => {
      mockGet.mockResolvedValue({ data: [] })
      response = await labwhere.getPlatesFromBoxBarcodes(boxBarcodes)
      expect(response.success).toBeFalsy()
      expect(response.error).toBe('The box has no plates')
    })
  })
})
