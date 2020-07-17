import axios from 'axios'
import LighthouseSampleMetadataForPlate from '../data/lighthouse_sample_metadata_for_plate'
import * as Modules from '@/modules/lighthouse_service'

describe('lighthouse_service api', () => {
  it('#getPlateMapMetadataFromLighthouseService', () => {
    const mock = jest.spyOn(axios, 'get')
    const plateBarcodes = ['aBarcode1', 'aBarcode2']

    Modules.getPlateMapMetadataFromLighthouseService({
      plateBarcodes
    })
    expect(mock).toHaveBeenCalledTimes(plateBarcodes.length)
    // expect(mock).toHaveBeenNthCalledWith(
    //   1,
    //   "http://localhost:5000/samples?where['plate_barcode']=aBarcode1}"
    // )
    // expect(mock).toHaveBeenNthCalledWith(
    //   2,
    //   "http://localhost:5000/samples?where['plate_barcode']=aBarcode2}"
    // )
  })

  it('#filterSamplesByPlateBarcode', async () => {
    const mock = jest.spyOn(axios, 'get')
    const expected = LighthouseSampleMetadataForPlate
    mock.mockResolvedValue(expected)
    const result = await Modules.filterSamplesByPlateBarcode('aBarcode')
    // expect(mock).toHaveBeenCalledWith(
    //   "http://localhost:5000/samples?where['plate_barcode']=aBarcode}"
    // )
    // expect(mock).toHaveBeenCalledTimes(1)
    expect(result.length).toEqual(expected.data._items.length)
  })

  it('#getMetadata', () => {
    const result = Modules.getMetadata(
      LighthouseSampleMetadataForPlate.data._items
    )
    result.map((r) => {
      expect(r).toHaveProperty('rootSampleID')
      expect(r).toHaveProperty('result')
    })
  })
})
