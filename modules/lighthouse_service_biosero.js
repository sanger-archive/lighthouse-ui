// Lighthouse Service Biosero Module

import axios from 'axios'
import config from '@/nuxt.config'

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
      event_type: 'lh_biosero_cp_destination_plate_partial_completed',
      barcode: form.barcode,
      user_id: form.username,
    }
    const headers = { headers: { Authorization: config.privateRuntimeConfig.lighthouseApiKey } }

    // https://github.com/axios/axios#response-schema
    const response = await axios.post(url, body, headers)

    /**
    Example of success:

    HTTP/1.0 201 CREATED
    Content-Length: 258
    Content-Type: application/json
    Date: Tue, 13 Jul 2021 11:15:46 GMT
    Location: http://localhost:8000/events/60ed75e2ffce63a55dec3bdf
    Server: Werkzeug/2.0.1 Python/3.8.7

    {
        "_created": "2021-07-13T11:15:46",
        "_etag": "95e225c1f1a3b82a35f11b9f53246d6db591900c",
        "_id": "60ed75e2ffce63a55dec3bdf",
        "_links": {
            "self": {
                "href": "events/60ed75e2ffce63a55dec3bdf",
                "title": "Event"
            }
        },
        "_status": "OK",
        "_updated": "2021-07-13T11:15:46"
    }
    */

    /**
    Example of fail

    HTTP/1.0 422 UNPROCESSABLE ENTITY
    Content-Length: 233
    Content-Type: application/json
    Date: Tue, 13 Jul 2021 11:11:05 GMT
    Server: Werkzeug/2.0.1 Python/3.8.7

    {
        "_error": {
            "code": 422,
            "message": "Insertion failure: 1 document(s) contain(s) error(s)"
        },
        "_issues": {
            "event_type": "'barcode' cannot be empty with the 'lh_biosero_cp_destination_plate_partial_completed' event"
        },
        "_status": "ERR"
    }
     */
    if (response.status === 201) {
      // successfully created the event and performed subsequent processes
      return {
        success: true,
        response: `Successfully created destination plate with barcode: ${form.barcode}`,
      }
    } else {
      // contains status code and message
      const error = response.data._error
      return {
        success: false,
        error,
      }
    }
  } catch (error) {
    // failure
    if (Object.prototype.hasOwnProperty.call(error, 'response')) {
      return { success: false, error: error.response.data._error }
    } else {
      return { success: false, error }
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
const failDestinationPlateBiosero = async (form) => {
  const url = `${config.privateRuntimeConfig.lighthouseBaseURL}/events`
  const body = {
    event_type: 'lh_biosero_cp_destination_plate_failed',
    barcode: form.barcode,
    user_id: form.username,
    failure_type: form.failureType,
  }

  const headers = { headers: { Authorization: config.privateRuntimeConfig.lighthouseApiKey } }

  try {
    const response = await axios.post(url, body, headers)
    if (response.data._status === 'OK') {
      // successfull insert of fail event
      return {
        success: true,
        response: `Successfully failed destination plate with barcode: ${form.barcode}`,
      }
    } else {
      let error
      // for an unsuccessfull insert via cherrytrack
      error = response.data?._error.message
      // other
      if (error === undefined) {
        error = response._error
      }

      return {
        success: false,
        error,
      }
    }
  } catch (ex) {
    let error
    const data = ex.response?.data

    if (data !== undefined) {
      // exception was from cherrytrack, add primary message
      error = data._error?.message
      // then add more useful message which is down in issues section
      const wellsMessage = data._issues?.wells[0]
      if (wellsMessage !== undefined) {
        error = error + ' ' + wellsMessage
      }
    } else {
      // other exception, use error at top level
      error = ex.message
    }

    return { success: false, error }
  }
}

const getBioseroPlate = async (barcode, type) => {
  try {
    const url = `${config.privateRuntimeConfig.lighthouseBaseURL}/plates/cherrytrack`
    const response = await axios.get(url + `?barcode=${barcode}&_type=${type}`)
    const plate = { success: true, [type]: true, ...response.data.plate.data }

    return plate
  } catch (error) {
    return { success: false }
  }
}

const lighthouseBiosero = {
  createDestinationPlateBiosero,
  failDestinationPlateBiosero,
  getBioseroPlate
}

export default lighthouseBiosero
