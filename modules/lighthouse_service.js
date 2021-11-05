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
        _exclude: 'pickable_samples',
      },
    })
    return { success: true, ...response.data }
  } catch (error) {
    return { success: false, error }
  }
}

const getSearchDateString = (daysAgo) => {
  const dt = new Date()
  dt.setDate(dt.getDate() - daysAgo)
  return dt.toISOString().slice(0, 19) // first 19 characters for format yyyy-mm-ddThh:mm:ss
}

const getImports = async () => {
  try {
    const response = await axios.get(
      // Get results for the past 4 weeks, in reverse date order, limited to 10000 results
      `${
        config.privateRuntimeConfig.lighthouseBaseURL
      }/imports?max_results=10000&sort=-date&where={"date": {"$gt": "${getSearchDateString(28)}"}}`
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
 * @returns {list} a represtation of the plate specs in a nested list e.g. [[1,2],[3,4]]
 */
const formatPlateSpecs = (plateSpecs) => {
  return plateSpecs.map((plate) => {
    return [plate.numberOfPlates, plate.numberOfPositives]
  })
}

/**
 * Create a test run
 * @param {integer} plateSpecs a list of objects containing information about the test run to create
 * @param {integer} addToDart boolean flag whether run is to be added to DART
 * @returns {object} an object containing success boolean, and response infomation
 */
const generateTestRun = async (plateSpecs, addToDart) => {
  const plateSpecsParam = formatPlateSpecs(plateSpecs)
  try {
    const url = new URL('cherrypick-test-data', config.privateRuntimeConfig.lighthouseBaseURL)

    const body = {
      plate_specs: plateSpecsParam,
      add_to_dart: addToDart,
    }
    const headers = { headers: { Authorization: config.privateRuntimeConfig.lighthouseApiKey } }

    const response = await axios.post(url.href, body, headers)

    return {
      success: true,
      runId: response.data._id,
    }
  } catch (error) {
    return errorResponse(error)
  }
}

/**
 * Get all test runs
 * @param {integer} currentPage supports pagination
 * @param {integer} maxResults supports pagination
 * @returns {object} an object containing success boolean, and response infomation
 */
const getTestRuns = async (currentPage, maxResults) => {
  try {
    const url = new URL('cherrypick-test-data', config.privateRuntimeConfig.lighthouseBaseURL)

    url.searchParams.append('max_results', maxResults)
    url.searchParams.append('page', currentPage)
    url.searchParams.append('sort', '-_created')

    const headers = { headers: { Authorization: config.privateRuntimeConfig.lighthouseApiKey } }

    const response = await axios.get(url.href, headers)

    response.data._items.forEach((run) => {
      run.total_plates = run.plate_specs.reduce(function (acc, obj) {
        return acc + obj[0]
      }, 0)
    })

    return {
      success: true,
      response: response.data._items,
      total: response.data._meta.total,
    }
  } catch (error) {
    return errorResponse(error)
  }
}

/**
 * Get test run
 * @param {integer} id the id of the test run to retrieve
 * @returns {object} an object containing success boolean, and response infomation
 */
const getTestRun = async (id) => {
  try {
    const url = new URL(`cherrypick-test-data/${id}`, config.privateRuntimeConfig.lighthouseBaseURL)

    const headers = { headers: { Authorization: config.privateRuntimeConfig.lighthouseApiKey } }

    const response = await axios.get(url.href, headers)

    return {
      success: true,
      response: response.data,
    }
  } catch (error) {
    return errorResponse(error)
  }
}

const errorResponse = (error) => {
  let msg = error.response ? error.response.data._error.message : 'An unexpected error has occured'
  if (error.response && error.response.data._issues) {
    let output = ''

    for (const [key, value] of Object.entries(error.response.data._issues)) {
      output += key + ': ' + value + '; '
    }
    msg = msg.concat(': ', output)
  }

  return {
    success: false,
    error: msg,
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
  formatPlateSpecs,
}

export default lighthouse
