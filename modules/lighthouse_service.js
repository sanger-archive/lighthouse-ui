// Lighthouse Service Module
// Accepts a list of plateBarcodes in the moduleOptions
// Send a POST request to the Lighthouse service API
// To create each plate
// Return list of responses

import axios from 'axios'
import config from '@/nuxt.config'

const handlePromise = async (promise) => {
  let rawResponse
  try {
    rawResponse = await promise
  } catch (resp) {
    rawResponse = resp.response.data
  }
  return rawResponse
}

const createPlatesFromBarcodes = async (moduleOptions) => {
  const plateBarcodes = moduleOptions.plateBarcodes

  const promises = plateBarcodes.map((barcode) => {
    const url = `${config.privateRuntimeConfig.lighthouseBaseURL}/plates/new`
    return axios.post(url, { barcode })
  })

  const responses = await Promise.all(
    promises.map((promise) => handlePromise(promise))
  )
  return responses
}

export { createPlatesFromBarcodes }
