import axios from 'axios'
import PlatesJson from '../data/labwhere_plates'
import { getPlatesFromBoxBarcodes } from '@/modules/labwhere'

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

      response = await getPlatesFromBoxBarcodes(boxBarcodes)
      expect(response.success).toBeTruthy()
      expect(response.plateBarcodes).toEqual(['AB123', 'CD456'])
    })

    it('when there is an error', async () => {
      mockGet.mockImplementationOnce(() =>
        Promise.reject(new Error('There was an error'))
      )
      response = await getPlatesFromBoxBarcodes(boxBarcodes)
      expect(response.success).toBeFalsy()
      expect(response.plateBarcodes).not.toBeDefined()
    })

    // This is the same as the above but worth adding for consistency
    it('when the box does not exist', async () => {
      mockGet.mockImplementationOnce(() =>
        Promise.reject(new Error('There was an error'))
      )
      response = await getPlatesFromBoxBarcodes(['dodgybarcode'])
      expect(response.success).toBeFalsy()
      expect(response.plateBarcodes).not.toBeDefined()
      expect(response.error).toEqual(new Error('There was an error'))
    })

    it('when the box has no plates', async () => {
      mockGet.mockResolvedValue({ data: [] })
      response = await getPlatesFromBoxBarcodes(boxBarcodes)
      expect(response.success).toBeFalsy()
      expect(response.error).toEqual('The box has no plates')
    })
  })
})
