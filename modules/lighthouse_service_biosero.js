// Lighthouse Service Biosero Module

import config from '@/nuxt.config'
import axios from 'axios'

/**
 * - Returned on success: `{ success: true, response: "A successful message" }`
 * - Returned on failure: `{ success: false, errors: ["A failure message"] }`
 *
 * @param {*} form
 * @returns
 */
const createDestinationPlateBiosero = async (form) => {
  try {
    const url = `${config.privateRuntimeConfig.lighthouseBaseURL}/events`
    const body = {
      'event_type': 'lh_biosero_cp_destination_plate_partial_completed',
      'barcode': form.barcode,
      'user_id': form.username
    }

    const response = await axios.post(url, body)

    if (response.status_code === 201) {
      // success
      return {
        success: true,
        response: `Successfully created destination plate with barcode: ${form.barcode}`,
      }
    } else {
      // constains status code and message
      const errors = response.data._error
      // failure
      return {
        success: false,
        errors,
      }
    }
  } catch (error) {
    // failure
    return { success: false, error }
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
const failDestinationPlateBiosero = async (form) => {
  try {
    const url = `${config.privateRuntimeConfig.lighthouseBaseURL}/events`
    const body = {
      'event_type': 'lh_biosero_cp_destination_failed',
      'barcode': form.barcode,
      'user_id': form.username,
      'failure_type': form.failureType
    }

    const response = await axios.post(url, body)

    if (response.status_code === 201) {
      // success
      return {
        success: true,
        response: `Successfully failed destination plate with barcode: ${form.barcode}`
      }
    } else {
      const errors = response.data._error
      // failure
      return {
        success: false,
        errors
      }
    }
  } catch (error) {
    // failure
    return { success: false, error }
  }
}

const lighthouseBiosero = {
  createDestinationPlateBiosero,
  failDestinationPlateBiosero
}

export default lighthouseBiosero
