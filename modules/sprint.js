import axios from 'axios'
import config from '@/nuxt.config'

const query = `mutation printRequest($printRequest: PrintRequest!, $printer: String!) {
  print(printRequest: $printRequest, printer: $printer) {
    jobId
  }`

// Will create a new layout object for a print job
// Requires barcode which will be used for barcode and text field
const createLayout = (barcode) => ({
  "barcodeFields": [
    {
      "x": 16,
      "y": 1,
      "cellWidth": 0.2,
      "barcodeType": "code39",
      "value": barcode,
      "height": 5
    }
  ],
  "textFields": [
    {
      "x": 3,
      "y": 3,
      "value": barcode,
      "font": "proportional",
      "fontSize": 1.7
    },
    {
      "x": 57,
      "y": 3,
      "value": "LHTR",
      "font": "proportional",
      "fontSize": 1.7
    }
  ]
})

// TODO: currently this is just a placeholder for creating barcodes
// n = number of barcodes
// e.g. if n = 3 returns ['DN111111', 'DN111111', 'DN111111']
const createBarcodes = (n) => Array.from(Array(n)).map(barcode => 'DN111111')

/* 
  Creates the print request body
  A query can have multiple layouts
  the number of layouts is dependent on the numberOfBarcodes
  the printer must be specified
*/
const createPrintRequestBody = ({numberOfBarcodes, printer}) => ({
  "query": query,
  printer,
  "printRequest": {
    // creates n barcodes and then turns each barcode into a layout
    layouts: createBarcodes(numberOfBarcodes).map(barcode => createLayout(barcode))
  }
})

const printLabels = async ({numberOfBarcodes, printer}) => {
  const body = createPrintRequestBody({numberOfBarcodes, printer})
  try {
    await axios.post(
      config.privateRuntimeConfig.sprintBaseURL, body
    )
    return {
      success: true,
      message: `successfully printed ${numberOfBarcodes} labels to ${printer}`
    }
  } catch (error) {
    return {
      success: false,
      error
    }
  }
}

const sprint = {
  createLayout,
  createPrintRequestBody,
  createBarcodes,
  printLabels
}

export default sprint