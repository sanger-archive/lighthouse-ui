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
    const headers = { headers: { Authorization: config.privateRuntimeConfig.lighthouseApiKey } }

    const response = await axios.post(url, body, headers)

    // example of success
    // {"_updated": "2021-07-09T15:52:45", "_created": "2021-07-09T15:52:45", "_etag": "f76fea7e3f65c384f0faa1249f52adc923a1ead8",
    // "_id": "60e870cddc3379e79ee69ebc", "_links": {"self": {"title": "Event", "href": "events/60e870cddc3379e79ee69ebc"}}, "_status": "OK"}

    // example of fail
    // {"_status": "ERR", "_issues": {"event_type": "unallowed event type 'wrong_event_type'"},
    // "_error": {"code": 422, "message": "Insertion failure: 1 document(s) contain(s) error(s)"}}

    if (response._status === 'OK') {
      // success
      return {
        success: true,
        response: `Successfully created destination plate with barcode: ${form.barcode}`,
      }
    } else {
      // contains status code and message
      const errors = response._error
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
      'event_type': 'lh_biosero_cp_destination_plate_failed',
      'barcode': form.barcode,
      'user_id': form.username,
      'failure_type': form.failureType
    }

    const headers = { headers: { Authorization: config.privateRuntimeConfig.lighthouseApiKey } }

    const response = await axios.post(url, body, headers)

    if (response._status === 'OK') {
      // success
      return {
        success: true,
        response: `Successfully failed destination plate with barcode: ${form.barcode}`
      }
    } else {
      const errors = response._error
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
