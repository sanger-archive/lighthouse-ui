import PlatesJson from '../data/plates'
import { labwhereRequest, getPlates } from '@/modules/labwhere'
import config from '@/nuxt.config'

const axios = {
  get: jest.fn()
}

describe('Labwhere', () => {
  describe('#getPlates', () => {
    let labwareBarcodes, boxBarcode

    beforeEach(() => {
      boxBarcode = 'lw-ogilvie-4'
    })

    it('successfully', async () => {
      axios.get.mockResolvedValue({ data: PlatesJson })
      labwareBarcodes = await getPlates(axios, boxBarcode)
      expect(labwareBarcodes).toEqual([
        'lw-aa216-5',
        'lw-aa215-6',
        'lw-aa214-7',
        'lw-aa213-8',
        'lw-aa212-9',
        'lw-aa209-10'
      ])
    })

    it('labwhere request', () => {
      expect(labwhereRequest.defaults.baseURL).toEqual(
        config.privateRuntimeConfig.labwhereBaseURL
      )
    })

    it('when there is an error', async () => {
      axios.get.mockImplementationOnce(() =>
        Promise.reject(new Error('There was an error'))
      )
      labwareBarcodes = await getPlates(axios, boxBarcode)
      expect(labwareBarcodes).toEqual([])
    })

    // This is the same as the above but worth adding for consistency
    it('when the box does not exist', async () => {
      axios.get.mockImplementationOnce(() =>
        Promise.reject(new Error('There was an error'))
      )
      labwareBarcodes = await getPlates(axios, 'dodgybarcode')
      expect(labwareBarcodes).toEqual([])
    })

    it('when the box has no plates', async () => {
      axios.get.mockResolvedValue({ data: [] })
      labwareBarcodes = await getPlates(axios, boxBarcode)
      expect(labwareBarcodes).toEqual([])
    })
  })
})
