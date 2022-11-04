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
    'Content-Type': 'application/json',
  },
}

// Will create a new layout object for a print job
// Requires barcode which will be used for barcode and text field
// TODO: how do we turn this into external json
const createLayout = ({ barcode, text }) => ({
  barcodeFields: [
    {
      x: 20,
      y: 1,
      cellWidth: 0.2,
      barcodeType: 'code39',
      value: barcode,
      height: 5,
    },
  ],
  textFields: [
    {
      x: 3,
      y: 3,
      value: barcode,
      font: 'proportional',
      fontSize: 1.7,
    },
    {
      x: 70,
      y: 3,
      value: text,
      font: 'proportional',
      fontSize: 1.7,
    },
  ],
})

/*
  Creates the print request body
  A query can have multiple layouts
  the number of layouts is dependent on the number of LabelFields
  the printer must be specified
*/
const createPrintRequestBody = ({ labelFields, printer }) => ({
  query,
  variables: {
    printer,
    printRequest: {
      // turns each labelField into a layout
      layouts: labelFields.map((labelField) => createLayout(labelField)),
    },
  },
})

/*
  adds the text for each barcode to generate an
  array of objects which will have a barcode and text
  the text will be the same for all barcodes
  e.g. createLabelFields(barcodes: ['DN111111', 'DN222222'], text: 'LHTR')
  will return [ { barcode: 'DN111111', text: 'LHTR' }, { barcode: 'DN222222', text: 'LHTR' } ]
*/
const createLabelFields = ({ barcodes, text }) => {
  return barcodes.map((barcode) => ({ barcode, text }))
}

/*
  accepts labelFields and printer
  will create the print request body
  and send a request to sprint to print labels
*/
const printLabels = async ({ labelFields, printer }) => {
  try {
    const payload = createPrintRequestBody({ labelFields, printer })

    const response = await axios.post(config.privateRuntimeConfig.sprintBaseURL, payload, headers)

    // because this is GraphQL it will always be a success unless it is a 500
    // so we need to extract the error messages and turn it into an error object
    if (response.data.errors)
      throw new Error(response.data.errors.map(({ message }) => message).join(','))

    return {
      success: true,
      message: `Successfully printed ${labelFields.length} labels to ${printer}`,
    }
  } catch (error) {
    return {
      success: false,
      error,
    }
  }
}

/*
  accepts count and printer
  count is the number of barcodes which is what baracoda needs
  creates the barcodes via a call to baracoda
  will create the print request body
  and send a request to sprint to print labels
*/
const printDestinationPlateLabels = async ({ numberOfBarcodes, printer }) => {
  try {
    let response = await Baracoda.createBarcodes({ count: numberOfBarcodes })

    // we don't want to proceed unless the barcodes have been created
    if (!response.success) throw response.error

    // we need to turn the barcodes into a bunch of label fields
    const labelFields = createLabelFields({ ...response, text: 'LHTR' })

    // print the labels
    // TODO: similar implementation to printLabels. Can we pass a function?
    response = await Sprint.printLabels({ labelFields, printer })

    if (response.success) {
      return response
    }

    throw response.error
  } catch (error) {
    return {
      success: false,
      error,
    }
  }
}

const Sprint = {
  createLayout,
  createPrintRequestBody,
  printLabels,
  printDestinationPlateLabels,
  headers,
  createLabelFields,
}

export default Sprint
