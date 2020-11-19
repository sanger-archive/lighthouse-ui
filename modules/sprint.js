import axios from 'axios'
import Baracoda from '@/modules/baracoda'
import config from '@/nuxt.config'

const query = `mutation printRequest($printRequest: PrintRequest!, $printer: String!) {
  print(printRequest: $printRequest, printer: $printer) {
    jobId
  }
}`

const headers = {
  headers: {
    'Content-Type': 'application/json'
  }
}

// Will create a new layout object for a print job
// Requires barcode which will be used for barcode and text field
const createLayout = (barcode) => ({
  barcodeFields: [
    {
      x: 16,
      y: 1,
      cellWidth: 0.2,
      barcodeType: 'code39',
      value: barcode,
      height: 5
    }
  ],
  textFields: [
    {
      x: 3,
      y: 3,
      value: barcode,
      font: 'proportional',
      fontSize: 1.7
    },
    {
      x: 57,
      y: 3,
      value: 'LHTR',
      font: 'proportional',
      fontSize: 1.7
    }
  ]
})

/* 
  Creates the print request body
  A query can have multiple layouts
  the number of layouts is dependent on the numberOfBarcodes
  the printer must be specified
*/
const createPrintRequestBody = ({ barcodes, printer }) => ({
  query,
  variables: {
    printer,
    printRequest: {
      // creates n barcodes and then turns each barcode into a layout
      layouts: barcodes.map((barcode) => createLayout(barcode))
    }
  }
})

/*
  accepts count and printer
  count is the number of barcodes which is what baracoda needs
  creates the barcodes via a call to plate barcpde
  will create the print request body
  and send a request to sprint to print labels
*/
const printLabels = async ({ numberOfBarcodes, printer }) => {
  try {
    let response = await Baracoda.createBarcodes({ count: numberOfBarcodes })

    // we don't want to proceed unless the barcodes have been created
    if (!response.success) throw response.error

    // we know that if it is successfull it will contain the barcodes so we
    // can throw the whole response at it.
    const payload = createPrintRequestBody({ ...response, printer })

    response = await axios.post(
      config.privateRuntimeConfig.sprintBaseURL,
      payload,
      headers
    )

    // because this is GraphQL it will always be a success unless it is a 500
    // so we need to extract the error messages and turn it into an error object
    if (response.data.errors)
      throw new Error(
        response.data.errors.map(({ message }) => message).join(',')
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

const Sprint = {
  createLayout,
  createPrintRequestBody,
  printLabels,
  headers
}

export default Sprint
