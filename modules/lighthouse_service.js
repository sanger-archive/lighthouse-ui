// Lighthouse Service Module

import config from '@/nuxt.config'
import axios from 'axios'

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
// Send a POST request to the Lighthouse service API to create each plate
// Return list of responses
const createPlatesFromBarcodes = async ({ barcodes }) => {
  const promises = barcodes.map((barcode) => {
    const url = `${config.privateRuntimeConfig.lighthouseBaseURL}/plates/new`
    return axios.post(url, { barcode })
  })

  const responses = await Promise.all(promises.map((promise) => handlePromise(promise)))
  return responses
}

// Accepts a list of barcodes in the moduleOptions
// Send a GET request to the Lighthouse service API
const findPlatesFromBarcodes = async ({ barcodes }) => {
  const url = `${config.privateRuntimeConfig.lighthouseBaseURL}/plates`
  try {
    const response = await axios.get(url, {
      params: {
        barcodes: barcodes.join(','),
        '_exclude': 'pickable_samples'
      },
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
      data: response.data,
    }
  } catch (error) {
    return {
      success: false,
      error,
    }
  }
}

// Delete list of reports using full filenames
const deleteReports = async (filenames) => {
  try {
    await axios.post(`${config.privateRuntimeConfig.lighthouseBaseURL}/delete_reports`, {
      data: {
        filenames,
      },
    })
    return {
      success: true,
    }
  } catch (error) {
    return {
      success: false,
      error,
    }
  }
}

// Get all of the reports
const getReports = async () => {
  try {
    const response = await axios.get(`${config.privateRuntimeConfig.lighthouseBaseURL}/reports`)
    return {
      success: true,
      reports: response.data.reports,
    }
  } catch (error) {
    return {
      success: false,
      error,
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
      reports: response.data.reports,
    }
  } catch (error) {
    return {
      success: false,
      error,
    }
  }
}

// Get Robots
const getRobots = async () => {
  try {
    const response = await axios.get(
      `${config.privateRuntimeConfig.lighthouseBaseURL}/beckman/robots`
    )
    return {
      success: true,
      robots: response.data.robots,
    }
  } catch (resp) {
    const errors = resp.response
      ? resp.response.data.errors
      : [resp.message + ': Failed to get Robots from Lighthouse Service']
    return {
      success: false,
      errors,
    }
  }
}

// Get Failure Types
const getFailureTypes = async () => {
  try {
    const response = await axios.get(
      `${config.privateRuntimeConfig.lighthouseBaseURL}/beckman/failure-types`
    )
    return {
      success: true,
      failureTypes: response.data.failure_types,
    }
  } catch (resp) {
    const errors = resp.response
      ? resp.response.data.errors
      : [resp.message + ': Failed to get Failure Types from Lighthouse Service']
    return {
      success: false,
      errors,
    }
  }
}

/**
 * - Returned on success: `{ success: true, response: "A successful message" }`
 * - Returned on failure: `{ success: false, errors: ["A failure message"] }`
 *
 * @param {*} form
 * @returns
 */
const createDestinationPlateBeckman = async (form) => {
  try {
    const response = await axios.get(
      `${config.privateRuntimeConfig.lighthouseBaseURL}` +
      '/cherrypicked-plates' +
      '/create?' +
      `barcode=${form.barcode}&` +
      `robot=${form.robotSerialNumber}&` +
      `user_id=${form.username}`
    )
    const responseData = response.data.data
    // success
    return {
      success: true,
      response: `Successfully created destination plate, with barcode: ${responseData.plate_barcode}, and ${responseData.count_fit_to_pick_samples} fit to pick sample(s)`,
    }
  } catch (resp) {
    const errors = resp.response.data
    // failure
    return {
      success: false,
      ...errors,
    }
  }
}

/**
 * - Returned on success: `{ success: true, errors: [] }`
 * - Returned on partial success: `{ success: true, errors: ["A successful error message"] }`
 * - Returned on failure: `{ success: false, errors: ["A failure message"] }`
 *
 * @param {*} form
 * @returns
 */
const failDestinationPlateBeckman = async (form) => {
  try {
    const response = await axios.get(
      `${config.privateRuntimeConfig.lighthouseBaseURL}` +
      '/cherrypicked-plates' +
      '/fail?' +
      `barcode=${form.barcode}&` +
      `robot=${form.robotSerialNumber}&` +
      `user_id=${form.username}&` +
      `failure_type=${form.failureType}`
    )
    // partial success
    if (response.data.errors.length > 0) {
      return {
        success: true,
        errors: response.data.errors,
      }
    }
    // success
    return {
      success: true,
      response: `Successfully failed destination plate with barcode: ${form.barcode}`,
    }
  } catch (resp) {
    const errors = resp.response.data
    // failure
    return {
      success: false,
      ...errors,
    }
  }
}

/**
 * Format the plate specs to the expected type
 * @param {*} plateSpecs a list of objects e.g. [{numberOfPlates: 1, numberOfPositives: 2}, {numberOfPlates: 3, numberOfPositives: 4}]
 * @returns {list} plateSpecsList a string represtation of the plate specs in a nested list e.g. [[1,2],[3,4]]
 */
const formatPlateSpecs = (plateSpecs) => {
  return plateSpecs.map((plate) => { return [plate.numberOfPlates, plate.numberOfPositives] })
}

// Create a test run
const generateTestRun = async (plateSpecs, addToDart) => {
  const plateSpecsParam = formatPlateSpecs(plateSpecs)
  try {
    const url = `${config.privateRuntimeConfig.lighthouseBaseURL}/cherrypick-test-data`
    const body = {
      'plate_specs': plateSpecsParam,
      'add_to_dart': addToDart,
    }
    const headers = { headers: { Authorization: config.privateRuntimeConfig.lighthouseApiKey } }

    const response = await axios.post(url, body, headers)

    return {
      success: true,
      runId: response.data._id,
    }
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data._error.message : 'An unexpected error has occured'
    }
  }
}

// Get all test runs
const getTestRuns = async (currentPage, perPage) => {
  try {
    // TODO: refactor path
    const url = `${config.privateRuntimeConfig.lighthouseBaseURL}/cherrypick-test-data?max_results=${perPage}&page=${currentPage}&sort=[("_created", -1)]`

    const headers = { headers: { Authorization: config.privateRuntimeConfig.lighthouseApiKey } }

    const response = await axios.get(url, headers)

    // TODO: add total number of plates in run to response
    // format barcodes from "[[\"TEST-112408\", \"number of positives: 0\"]]" here
    return {
      success: true,
      response: response.data._items,
      total: response.data._meta.total,
    }
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data._error.message : 'An unexpected error has occured'
    }
  }
}


const getTestRun = async (id) => {
  try {
    const url = `${config.privateRuntimeConfig.lighthouseBaseURL}/cherrypick-test-data/${id}`

    const headers = { headers: { Authorization: config.privateRuntimeConfig.lighthouseApiKey } }

    const response = await axios.get(url, headers)

    return {
      success: true,
      response: response.data
    }
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data._error.message : 'An unexpected error has occured'
    }
  }
}


const lighthouse = {
  createDestinationPlateBeckman,
  createPlatesFromBarcodes,
  createReport,
  deleteReports,
  failDestinationPlateBeckman,
  findPlatesFromBarcodes,
  getFailureTypes,
  getImports,
  getReports,
  getRobots,
  generateTestRun,
  getTestRuns,
  getTestRun,
  formatPlateSpecs
}

export default lighthouse
