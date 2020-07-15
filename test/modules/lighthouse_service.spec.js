import axios from 'axios'
import * as Modules from '@/modules/lighthouse_service'

describe('lighthouse_service api', () => {
  it('#getPlateMapMetadataFromLighthouseService', () => {
    const mock = jest.spyOn(axios, 'get')
    const plateBarcodes = ['aBarcode1', 'aBarcode2']

    Modules.getPlateMapMetadataFromLighthouseService({
      plateBarcodes
    })
    expect(mock).toHaveBeenCalledTimes(plateBarcodes.length)
  })

  it('#getMetadataForPlate', async () => {
    const mock = jest.spyOn(axios, 'get')
    const expected = 'test result'
    mock.mockResolvedValue(expected)
    const result = await Modules.getMetadataForPlate('aBarcode')
    expect(mock).toHaveBeenCalledWith(
      'http://localhost:5000/samples?where=aBarcode'
    )
    expect(result).toEqual(expected)
  })
})
