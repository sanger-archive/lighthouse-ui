import { handleApiCall } from '@/modules/api'
import * as labwareModule from '@/modules/labwhere'
import * as lighthouseModule from '@/modules/lighthouse_service'

describe('api', () => {
  describe('#handleApiCall ', () => {
    let boxBarcode, plateBarcodes

    it('is successful', async () => {
      plateBarcodes = ['aBarcode1', 'aBarcode2']
      labwareModule.getPlatesFromBoxBarcode = jest
        .fn()
        .mockReturnValue(plateBarcodes)

      lighthouseModule.createPlatesFromBarcodes = jest
        .fn()
        .mockReturnValue({ it: 'was successful' })

      const result = await handleApiCall(boxBarcode)

      expect(result).toEqual({ it: 'was successful' })
      expect(labwareModule.getPlatesFromBoxBarcode).toBeCalled()
      expect(lighthouseModule.createPlatesFromBarcodes).toBeCalled()
    })
  })
})
