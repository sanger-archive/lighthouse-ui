import axios from 'axios'
import config from '@/nuxt.config'

/*
  xml should be in format <?xml version="1.0" encoding="UTF-8"?><plate_barcodes><barcode>702261</barcode></plate_barcodes>
  extract the barcode and add a prefix.
  barcode can be 6 or more characters
  if it is not in the right format returns nothing
*/
const extractBarcode = (xml) => {
  const barcode = xml.match(/\d{6,}/)
  if (!barcode) return
  return `DN${barcode[0]}`
}

// creates a barcode from the plate barcode service
// the barcode will be extracted from the returned xml
const createBarcode = async () => {
  try {
    const response = await axios.post(
      config.privateRuntimeConfig.plateBarcodeBaseURL
    )
    return {
      success: true,
      barcode: extractBarcode(response.data)
    }
  } catch (error) {
    return {
      success: false,
      error
    }
  }
}

// return a bunch of barcodes. Plate barcode service can only create one barcode at a time
const createBarcodes = async (n) => {
  // produces an array of n items. Creates a barcode for each one and resolves all
  // of the promises. Without Promise.all we get a bunch of unresolved promises.
  const responses = await Promise.all(
    [...Array(n)].map(async (n) => await createBarcode())
  )

  // if none of the responses are successful we have a problem. Need to stop the process
  if (!responses.some((response) => response.success)) {
    throw new Error('Barcodes could not be created')
  }

  // Hopefully we can assume that users would rather have some barcodes rather than none.
  // This is an edge case but easy to implement. Just pass back any successes
  return responses
    .filter((response) => response.success)
    .map((response) => response.barcode)
}

const PlateBarcode = {
  extractBarcode,
  createBarcode,
  createBarcodes
}

export default PlateBarcode
