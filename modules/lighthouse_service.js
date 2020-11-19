// Lighthouse Service Module

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

// Accepts a list of barcodes in the moduleOptions
// Send a POST request to the Lighthouse service API
// To create each plate
// Return list of responses
const createPlatesFromBarcodes = async ({ barcodes }) => {
  const promises = barcodes.map((barcode) => {
    const url = `${config.privateRuntimeConfig.lighthouseBaseURL}/plates/new`
    return axios.post(url, { barcode })
  })

  const responses = await Promise.all(
    promises.map((promise) => handlePromise(promise))
  )
  return responses
}

// Accepts a list of barcodes in the moduleOptions
// Send a GET request to the Lighthouse service API
const findPlatesFromBarcodes = async ({ barcodes }) => {
  const url = `${config.privateRuntimeConfig.lighthouseBaseURL}/plates`
  try {
    const response = await axios.get(url, {
      params: { barcodes }
    })
    return { success: true, ...response.data }
  } catch (error) {
    return { success: false, error }
  }
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

// Delete list of reports using full filenames
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

// Get all of the reports
const getReports = async () => {
  try {
    const response = await axios.get(
      `${config.privateRuntimeConfig.lighthouseBaseURL}/reports`
    )
    return {
      success: true,
      reports: response.data.reports
    }
  } catch (error) {
    return {
      success: false,
      error
    }
  }
}

// Create a reports
const createReport = async () => {
  try {
    const response = await axios.post(
      `${config.privateRuntimeConfig.lighthouseBaseURL}/reports/new`
    )
    return {
      success: true,
      reports: response.data.reports
    }
  } catch (error) {
    return {
      success: false,
      error
    }
  }
}

const lighthouse = {
  createPlatesFromBarcodes,
  findPlatesFromBarcodes,
  getImports,
  deleteReports,
  getReports,
  createReport
}

export default lighthouse
