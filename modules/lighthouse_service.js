// Lighthouse Service Module
// Accepts a list of plateBarcodes in the moduleOptions
// Send a POST request to the Lighthouse service API
// To create each plate
// Return list of responses

import axios from 'axios'

const handlePromise = async (promise) => {
  let rawResponse
  try {
    rawResponse = await promise
  } catch (resp) {
    rawResponse = resp.response.data.errors
  }
  return rawResponse
}

const createPlatesFromBarcodes = async (moduleOptions) => {
  const plateBarcodes = moduleOptions.plateBarcodes

  const promises = plateBarcodes.map((barcode) => {
    const url = 'http://localhost:5000/plates/new'
    return axios.post(url, { barcode })
  })

  const responses = await Promise.all(
    promises.map((promise) => handlePromise(promise))
  )
  return responses
}

export { createPlatesFromBarcodes }

export default createPlatesFromBarcodes
