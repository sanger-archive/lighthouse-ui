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

const createBarcode = async () => {
  try {
    const response = await axios.post(
      config.privateRuntimeConfig.printBarcodeBaseURL,
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

const plateBarcode = {
  extractBarcode,
  createBarcode
}

export default plateBarcode