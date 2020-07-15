// Module to accept a list of plate barcodes
// Send a GET request to the lighthouse service api
// To return the plates metadata
// Including the RootSampleId and +ve/-ve result

import axios from 'axios'

const getMetadataForPlate = async (barcode) => {
  const url = `http://localhost:5000/samples?where=${barcode}`
  return await axios.get(url)
}

const getPlateMapMetadataFromLighthouseService = (moduleOptions) => {
  const plateBarcodes = moduleOptions.plateBarcodes
  const plateMetadata = plateBarcodes.map((plateBarcode) => {
    getMetadataForPlate(plateBarcode)
  })
  return plateMetadata
}

export { getMetadataForPlate, getPlateMapMetadataFromLighthouseService }

export default getPlateMapMetadataFromLighthouseService
