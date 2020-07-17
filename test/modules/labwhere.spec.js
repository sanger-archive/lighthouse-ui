import axios from 'axios'
import PlatesJson from '../data/plates'
import { labwhereRequestURL, getPlatesFromBoxBarcode } from '@/modules/labwhere'
import config from '@/nuxt.config'

describe('Labwhere', () => {
  describe('#getPlatesFromBoxBarcode', () => {
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

      labwareBarcodes = await getPlatesFromBoxBarcode(boxBarcode)
      expect(labwareBarcodes).toEqual(['AB123', 'CD456'])
    })

    it('labwhere request', () => {
      expect(labwhereRequestURL).toEqual(
        config.privateRuntimeConfig.labwhereBaseURL
      )
    })

    it('when there is an error', async () => {
      mock.mockImplementationOnce(() =>
        Promise.reject(new Error('There was an error'))
      )
      labwareBarcodes = await getPlatesFromBoxBarcode(boxBarcode)
      expect(labwareBarcodes).toEqual([])
    })

    // This is the same as the above but worth adding for consistency
    it('when the box does not exist', async () => {
      mock.mockImplementationOnce(() =>
        Promise.reject(new Error('There was an error'))
      )
      labwareBarcodes = await getPlatesFromBoxBarcode('dodgybarcode')
      expect(labwareBarcodes).toEqual([])
    })

    it('when the box has no plates', async () => {
      mock.mockResolvedValue({ data: [] })
      labwareBarcodes = await getPlatesFromBoxBarcode(boxBarcode)
      expect(labwareBarcodes).toEqual([])
    })
  })
})
