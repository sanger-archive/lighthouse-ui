import * as Modules from '@/modules/lighthouse_service'
import axios from 'axios'

describe('lighthouse_service api', () => {

  it('#getPlateMapMetadataFromLighthouseService', () => {
    let mock = jest.spyOn(axios, 'get')
    let plateBarcodes = ['aBarcode1', 'aBarcode2']

    Modules.getPlateMapMetadataFromLighthouseService({ 'plateBarcodes': plateBarcodes })  
    expect(mock).toHaveBeenCalledTimes(plateBarcodes.length)
  })

  it('#getMetadataForPlate', async () => {
    let mock = jest.spyOn(axios, 'get')
    let expected = 'test result'
    mock.mockResolvedValue(expected)
    let result = await Modules.getMetadataForPlate('aBarcode')
    expect(mock).toHaveBeenCalledWith('http://localhost:5000/samples?where=aBarcode')
    expect(result).toEqual(expected)
  })s
})