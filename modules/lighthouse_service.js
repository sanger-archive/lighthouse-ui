// Module to accept a list of plate barcodes
// Send a GET request to the lighthouse service api
// To return the plates metadata
// Including the RootSampleId and +ve/-ve result

import axios from 'axios'

const getMetadata = (samples) => {
  return samples.map((s) => ({
    rootSampleID: s['Root Sample ID'],
    result: s.Result
  }))
}

const filterSamplesByPlateBarcode = async (barcode) => {
  // const url = `http://localhost:5000/samples?where={'plate_barcode':${barcode}}`
  const url = `http://localhost:5000/samples?where['plate_barcode']=${barcode}`

  const response = await axios.get(url)
  const result = getMetadata(response.data._items)
  // console.log('Result: ', result)
  return result
}

const getPlateMapMetadataFromLighthouseService = (moduleOptions) => {
  const plateBarcodes = moduleOptions.plateBarcodes
  const plateMetadata = plateBarcodes.map((plateBarcode) => {
    filterSamplesByPlateBarcode(plateBarcode)
  })
  return plateMetadata
}

export {
  filterSamplesByPlateBarcode,
  getPlateMapMetadataFromLighthouseService,
  getMetadata
}

export default getPlateMapMetadataFromLighthouseService
