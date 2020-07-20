import { getPlatesFromBoxBarcode } from './labwhere'
import { createPlatesFromBarcodes } from './lighthouse_service'

// Main API handling of requests:
// 1. Request the plate barcodes in a given box barcode from LabWhere
// 2. For each plate, POST requests to Lighthouse service to create the plate,
//    creating only the plates +ve samples
// Return an list of plate barcodes and the number of +ve samples created in SS

const handleApiCall = async (boxBarcode) => {
  const platesForBoxBarcode = await getPlatesFromBoxBarcode(boxBarcode)

  if (platesForBoxBarcode.length === 0) {
    return {
      error: `Failed to get plate barcodes for box barcode: ${boxBarcode}`
    }
  }

  const resp = await createPlatesFromBarcodes({
    plateBarcodes: platesForBoxBarcode
  })

  return resp
}

export { handleApiCall }
