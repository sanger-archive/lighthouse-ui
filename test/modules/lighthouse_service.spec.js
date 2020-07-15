import * as Modules from '@/modules/lighthouse_service'
import axios from 'axios'

describe('lighthouse_service api', () => {

  // it('can be passed arguements of plate barcodes', () => {
  //   let plateBarcodes = ['A1234', 'B1234']
  //   Modules.getMetadataForPlate = jest.fn()

  //   Modules.getPlateMapMetadataFromLighthouseService({ 'plateBarcodes': plateBarcodes })  
  //   expect(Modules.getMetadataForPlate).toHaveBeenCalledTimes(plateBarcodes.length)
  // })

  it('#getMetadataForPlate', async () => {
    let mock = jest.spyOn(axios, 'get')
    let expected = 'test result'
    mock.mockResolvedValue(expected)
    let result = await Modules.getMetadataForPlate('aBarcode')
    expect(mock).toHaveBeenCalledWith('http://localhost:5000/samples?where=aBarcode')
    expect(result).toEqual(expected)
  })
})