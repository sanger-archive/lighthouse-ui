import axios from 'axios'
import PlatesJson from '../data/labwhere_plates'
import { getPlatesFromBoxBarcodes } from '@/modules/labwhere'

describe('Labwhere', () => {
  describe('#getPlatesFromBoxBarcodes', () => {
    let labwareBarcodes, boxBarcode, mock, response

    beforeEach(() => {
      mock = jest.spyOn(axios, 'get')
      boxBarcode = 'lw-ogilvie-4'
    })

    afterEach(() => {
      mock.mockRestore()
    })

    it('successfully', async () => {
      response = { data: PlatesJson }
      mock.mockResolvedValue(response)

      labwareBarcodes = await getPlatesFromBoxBarcodes(boxBarcode)
      expect(labwareBarcodes).toEqual(['AB123', 'CD456'])
    })

    it('when there is an error', async () => {
      mock.mockImplementationOnce(() =>
        Promise.reject(new Error('There was an error'))
      )
      labwareBarcodes = await getPlatesFromBoxBarcodes(boxBarcode)
      expect(labwareBarcodes).toEqual([])
    })

    // This is the same as the above but worth adding for consistency
    it('when the box does not exist', async () => {
      mock.mockImplementationOnce(() =>
        Promise.reject(new Error('There was an error'))
      )
      labwareBarcodes = await getPlatesFromBoxBarcodes('dodgybarcode')
      expect(labwareBarcodes).toEqual([])
    })

    it('when the box has no plates', async () => {
      mock.mockResolvedValue({ data: [] })
      labwareBarcodes = await getPlatesFromBoxBarcodes(boxBarcode)
      expect(labwareBarcodes).toEqual([])
    })
  })
})
