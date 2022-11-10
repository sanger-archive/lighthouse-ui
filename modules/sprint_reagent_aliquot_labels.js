import axios from 'axios'
import config from '@/nuxt.config'
import { query, headers } from '@/modules/sprint_constants'

// Will create a new layout object for a print job
// Requires barcode and two lines of text
// TODO: how do we turn this into external json
const createLayout = ({ barcode, firstText, secondText }) => ({
  barcodeFields: [
    {
      x: 39,
      y: 1,
      cellWidth: 0.2,
      barcodeType: 'code39',
      value: barcode,
      height: 4,
    },
  ],
  textFields: [
    {
      x: 3,
      y: 4,
      value: firstText,
      font: 'proportional',
      fontSize: 2.3,
    },
    {
      x: 3,
      y: 7,
      value: secondText,
      font: 'proportional',
      fontSize: 2.3,
    },
  ],
})

/*
  Creates the print request body
  A query can have multiple layouts
  the number of layouts is dependent on the specified quantity
  the printer must be specified
*/
const createPrintRequestBody = ({ barcode, firstText, secondText, printer, quantity }) => ({
  query,
  variables: {
    printer,
    printRequest: {
      // turns each labelField into a layout
      layouts: Array.from({length: quantity}, () => createLayout({ barcode, firstText, secondText })),
    },
  },
})

/*
  accepts fields to be printed on each label, printer and quantity of labels
  will create the print request body
  and send a request to sprint to print labels
*/
const printLabels = async ({ barcode, firstText, secondText, printer, quantity }) => {
  try {
    const parsedQuantity = parseInt(quantity)

    if (isNaN(parsedQuantity) || parsedQuantity < 1 || parsedQuantity > 100) {
      throw new Error("Quantity should be between 1 and 100.")
    }

    const payload = createPrintRequestBody({ barcode, firstText, secondText, printer, quantity: parsedQuantity })

    const response = await axios.post(config.privateRuntimeConfig.sprintBaseURL, payload, headers)

    // because this is GraphQL it will always be a success unless it is a 500
    // so we need to extract the error messages and turn it into an error object
    if (response.data.errors) {
      throw new Error(response.data.errors.map(({ message }) => message).join(','))
    }

    const labelString = parsedQuantity === 1 ? 'label' : 'labels'
    return {
      success: true,
      message: `Successfully printed ${parsedQuantity} ${labelString} to ${printer}`,
    }
  } catch (error) {
    return {
      success: false,
      error,
    }
  }
}

export default printLabels
export { createLayout, createPrintRequestBody }
