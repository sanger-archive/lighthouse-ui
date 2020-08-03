import axios from 'axios'
import * as Modules from '@/modules/lighthouse_service'
import config from '@/nuxt.config'

describe('lighthouse_service api', () => {
  describe('#createPlatesFromBarcodes ', () => {
    let mock, plateBarcodes, response

    beforeEach(() => {
      mock = jest.spyOn(axios, 'post')
    })

    afterEach(() => {
      mock.mockRestore()
    })

    it('for a single barcode on failure', async () => {
      plateBarcodes = ['aBarcode1']

      response = {
        errors: ['foreign barcode is already in use.']
      }

      mock.mockResolvedValue(response)

      const result = await Modules.createPlatesFromBarcodes({
        plateBarcodes
      })

      expect(result).toEqual([response])
      expect(mock).toHaveBeenCalledTimes(1)
      expect(mock).toHaveBeenNthCalledWith(
        1,
        `${config.privateRuntimeConfig.lighthouseBaseURL}/plates/new`,
        { barcode: plateBarcodes[0] }
      )
    })

    it('for a single barcode on success', async () => {
      plateBarcodes = ['aBarcode1']

      response = {
        data: {
          plate_barcode: 'aBarcode1',
          centre: 'tst1',
          number_of_positives: 3
        }
      }

      mock.mockResolvedValue(response)

      const result = await Modules.createPlatesFromBarcodes({
        plateBarcodes
      })

      expect(result).toEqual([response])
      expect(mock).toHaveBeenCalledTimes(1)
      expect(mock).toHaveBeenNthCalledWith(
        1,
        `${config.privateRuntimeConfig.lighthouseBaseURL}/plates/new`,
        { barcode: plateBarcodes[0] }
      )
    })

    it('#for multiple barcodes on failure', async () => {
      plateBarcodes = ['aBarcode1', 'aBarcode2']

      const response1 = {
        errors: ['foreign barcode is already in use.']
      }

      const response2 = {
        errors: ['No samples for this barcode']
      }

      mock.mockImplementationOnce(() => response1)
      mock.mockImplementationOnce(() => response2)

      const result = await Modules.createPlatesFromBarcodes({
        plateBarcodes
      })

      expect(result).toEqual([response1, response2])
      expect(mock).toHaveBeenCalledTimes(2)
      expect(mock).toHaveBeenNthCalledWith(
        1,
        `${config.privateRuntimeConfig.lighthouseBaseURL}/plates/new`,
        { barcode: plateBarcodes[0] }
      )
      expect(mock).toHaveBeenNthCalledWith(
        2,
        `${config.privateRuntimeConfig.lighthouseBaseURL}/plates/new`,
        { barcode: plateBarcodes[1] }
      )
    })

    it('#for multiple barcodes on success', async () => {
      plateBarcodes = ['aBarcode1', 'aBarcode2']

      const response1 = {
        data: {
          plate_barcode: 'aBarcode1',
          centre: 'tst1',
          number_of_positives: 3
        }
      }

      const response2 = {
        data: {
          plate_barcode: 'aBarcode2',
          centre: 'tst1',
          number_of_positives: 2
        }
      }

      mock.mockImplementationOnce(() => response1)
      mock.mockImplementationOnce(() => response2)

      const result = await Modules.createPlatesFromBarcodes({
        plateBarcodes
      })

      expect(result).toEqual([response1, response2])
      expect(mock).toHaveBeenCalledTimes(2)
      expect(mock).toHaveBeenNthCalledWith(
        1,
        `${config.privateRuntimeConfig.lighthouseBaseURL}/plates/new`,
        { barcode: plateBarcodes[0] }
      )
      expect(mock).toHaveBeenNthCalledWith(
        2,
        `${config.privateRuntimeConfig.lighthouseBaseURL}/plates/new`,
        { barcode: plateBarcodes[1] }
      )
    })

    it('#for multiple barcodes on partial success/ failure', async () => {
      plateBarcodes = ['aBarcode1', 'aBarcode2']

      const response1 = {
        errors: ['No samples for this barcode']
      }

      const response2 = {
        data: {
          plate_barcode: 'aBarcode2',
          centre: 'tst1',
          number_of_positives: 2
        }
      }

      mock.mockImplementationOnce(() => response1)
      mock.mockImplementationOnce(() => response2)

      const result = await Modules.createPlatesFromBarcodes({
        plateBarcodes
      })

      expect(result).toEqual([response1, response2])
      expect(mock).toHaveBeenCalledTimes(2)
      expect(mock).toHaveBeenNthCalledWith(
        1,
        `${config.privateRuntimeConfig.lighthouseBaseURL}/plates/new`,
        { barcode: plateBarcodes[0] }
      )
      expect(mock).toHaveBeenNthCalledWith(
        2,
        `${config.privateRuntimeConfig.lighthouseBaseURL}/plates/new`,
        { barcode: plateBarcodes[1] }
      )
    })
  })
})
