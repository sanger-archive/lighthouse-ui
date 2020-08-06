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

const getImports = async () => {
  try {
    const response = await axios.get(
      `${config.privateRuntimeConfig.lighthouseBaseURL}/imports?max_results=10000`
    )
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    return {
      success: false,
      error
    }
  }
}

const deleteReports = async (filenames) => {
  try {
    await axios.post(
      `${config.privateRuntimeConfig.lighthouseBaseURL}/delete_reports`,
      {
        data: {
          filenames
        }
      }
    )
    return {
      success: true
    }
  } catch (error) {
    return {
      success: false,
      error
    }
  }
}

export { createPlatesFromBarcodes, getImports, deleteReports }
