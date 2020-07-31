import { createSamples } from '@/modules/api'
import * as labwhereModule from '@/modules/labwhere'
import * as lighthouseModule from '@/modules/lighthouse_service'

describe('api', () => {
  describe('#createSamples ', () => {
    beforeEach(() => {
      boxBarcode = 'aBoxBarcode'
      labwhereResponse = {
        success: true,
        plateBarcodes: ['aBarcode1', 'aBarcode2']
      }
    })

    let boxBarcode, labwhereResponse

    it('both getPlatesFromBoxBarcodes and createPlatesFromBarcodes are successful', async () => {
      labwhereModule.getPlatesFromBoxBarcodes = jest
        .fn()
        .mockReturnValue(labwhereResponse)

      const expected = [
        {
          data: {
            plate_barcode: 'aBarcode1',
            centre: 'tst1',
            number_of_positives: 3
          }
        },
        {
          data: {
            plate_barcode: 'aBarcode2',
            centre: 'tst1',
            number_of_positives: 1
          }
        }
      ]

      lighthouseModule.createPlatesFromBarcodes = jest
        .fn()
        .mockReturnValue(expected)

      const result = await createSamples(boxBarcode)

      expect(result).toEqual(expected)
      expect(labwhereModule.getPlatesFromBoxBarcodes).toBeCalledWith(boxBarcode)
      expect(lighthouseModule.createPlatesFromBarcodes).toBeCalledWith(
        labwhereResponse
      )
    })

    it('getPlatesFromBoxBarcodes is successful, createPlatesFromBarcodes all fail', async () => {
      labwhereModule.getPlatesFromBoxBarcodes = jest
        .fn()
        .mockReturnValue(labwhereResponse)

      const expected = [
        {
          errors: ['No samples for this barcode']
        },
        {
          errors: ['No samples for this barcode']
        }
      ]

      lighthouseModule.createPlatesFromBarcodes = jest
        .fn()
        .mockReturnValue(expected)

      const result = await createSamples(boxBarcode)

      expect(result).toEqual(expected)
      expect(labwhereModule.getPlatesFromBoxBarcodes).toBeCalledWith(boxBarcode)
      expect(lighthouseModule.createPlatesFromBarcodes).toBeCalledWith(
        labwhereResponse
      )
    })

    it('getPlatesFromBoxBarcodes is successful, createPlatesFromBarcodes partially fail', async () => {
      labwhereModule.getPlatesFromBoxBarcodes = jest
        .fn()
        .mockReturnValue(labwhereResponse)

      const expected = [
        {
          errors: ['No samples for this barcode']
        },
        {
          data: {
            plate_barcode: 'aBarcode2',
            centre: 'tst1',
            number_of_positives: 1
          }
        }
      ]

      lighthouseModule.createPlatesFromBarcodes = jest
        .fn()
        .mockReturnValue(expected)

      const result = await createSamples(boxBarcode)

      expect(result).toEqual(expected)
      expect(labwhereModule.getPlatesFromBoxBarcodes).toBeCalledWith(boxBarcode)
      expect(lighthouseModule.createPlatesFromBarcodes).toBeCalledWith(
        labwhereResponse
      )
    })

    it('getPlatesFromBoxBarcodes fails', async () => {
      labwhereModule.getPlatesFromBoxBarcodes = jest.fn().mockReturnValue([])
      lighthouseModule.createPlatesFromBarcodes = jest.fn()

      const expected = [
        {
          errors: [
            `Failed to get plate barcodes for box barcode: ${boxBarcode}`
          ]
        }
      ]
      const result = await createSamples(boxBarcode)

      expect(result).toEqual(expected)
      expect(labwhereModule.getPlatesFromBoxBarcodes).toBeCalledWith(boxBarcode)
      expect(lighthouseModule.createPlatesFromBarcodes).not.toBeCalled()
    })
  })
})
