import axios from 'axios'
import * as Modules from '@/modules/lighthouse_service'

describe('lighthouse_service api', () => {
  // it('can be passed arguements of plate barcodes', () => {
  //   let plateBarcodes = ['A1234', 'B1234']
  //   Modules.getMetadataForPlate = jest.fn()

  //   Modules.getPlateMapMetadataFromLighthouseService({ 'plateBarcodes': plateBarcodes })
  //   expect(Modules.getMetadataForPlate).toHaveBeenCalledTimes(plateBarcodes.length)
  // })

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
