import { handleApiCall } from '@/modules/api'
import * as labwareModule from '@/modules/labwhere'
import * as lighthouseModule from '@/modules/lighthouse_service'

describe('api', () => {
  describe('#handleApiCall ', () => {
    beforeEach(() => {
      boxBarcode = 'aBoxBarcode'
      plateBarcodes = ['aBarcode1', 'aBarcode2']
    })

    let boxBarcode, plateBarcodes

    it('both getPlatesFromBoxBarcode and createPlatesFromBarcodes are successful', async () => {
      labwareModule.getPlatesFromBoxBarcode = jest
        .fn()
        .mockReturnValue(plateBarcodes)

      const responses = [
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
        .mockReturnValue(responses)

      const result = await handleApiCall(boxBarcode)

      expect(result).toEqual(responses)
      expect(labwareModule.getPlatesFromBoxBarcode).toBeCalledWith(boxBarcode)
      expect(lighthouseModule.createPlatesFromBarcodes).toBeCalledWith({
        plateBarcodes
      })
    })

    it('getPlatesFromBoxBarcode is successful, createPlatesFromBarcodes all fail', async () => {
      labwareModule.getPlatesFromBoxBarcode = jest
        .fn()
        .mockReturnValue(plateBarcodes)

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

      const result = await handleApiCall(boxBarcode)

      expect(result).toEqual(expected)
      expect(labwareModule.getPlatesFromBoxBarcode).toBeCalledWith(boxBarcode)
      expect(lighthouseModule.createPlatesFromBarcodes).toBeCalledWith({
        plateBarcodes
      })
    })

    it('getPlatesFromBoxBarcode is successful, createPlatesFromBarcodes partially fail', async () => {
      labwareModule.getPlatesFromBoxBarcode = jest
        .fn()
        .mockReturnValue(plateBarcodes)

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

      const result = await handleApiCall(boxBarcode)

      expect(result).toEqual(expected)
      expect(labwareModule.getPlatesFromBoxBarcode).toBeCalledWith(boxBarcode)
      expect(lighthouseModule.createPlatesFromBarcodes).toBeCalledWith({
        plateBarcodes
      })
    })

    it('getPlatesFromBoxBarcode fails', async () => {
      labwareModule.getPlatesFromBoxBarcode = jest.fn().mockReturnValue([])
      lighthouseModule.createPlatesFromBarcodes = jest.fn()

      const expected = {
        error: `Failed to get plate barcodes for box barcode: ${boxBarcode}`
      }
      const result = await handleApiCall(boxBarcode)

      expect(result).toEqual(expected)
      expect(labwareModule.getPlatesFromBoxBarcode).toBeCalledWith(boxBarcode)
      expect(lighthouseModule.createPlatesFromBarcodes).not.toBeCalled()
    })
  })
})
