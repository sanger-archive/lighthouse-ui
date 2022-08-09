import axios from 'axios'
import ReportsJson from '../data/reports'
import RobotsJson from '../data/robots'
import FailureTypesJson from '../data/failures_types.json'
import config from '@/nuxt.config'
import lighthouse from '@/modules/lighthouse_service'

describe('lighthouse_service api', () => {
  let mock, response

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('#createPlatesFromBarcodes', () => {
    let barcodes

    beforeEach(() => {
      mock = jest.spyOn(axios, 'post')
    })

    it('for a single barcode on failure', async () => {
      barcodes = ['aBarcode1']

      response = {
        errors: ['foreign barcode is already in use.'],
      }

      mock.mockResolvedValue(response)

      const result = await lighthouse.createPlatesFromBarcodes({
        barcodes,
      })

      expect(result).toEqual([response])
      expect(mock).toHaveBeenCalledTimes(1)
      expect(mock).toHaveBeenNthCalledWith(
        1,
        `${config.privateRuntimeConfig.lighthouseBaseURL}/plates/new`,
        {
          barcode: barcodes[0],
        }
      )
    })

    it('for a single barcode on success', async () => {
      barcodes = ['aBarcode1']

      response = {
        data: {
          plate_barcode: 'aBarcode1',
          centre: 'tst1',
          count_fit_to_pick_samples: 3,
        },
      }

      mock.mockResolvedValue(response)

      const result = await lighthouse.createPlatesFromBarcodes({
        barcodes,
      })

      expect(result).toEqual([response])
      expect(mock).toHaveBeenCalledTimes(1)
      expect(mock).toHaveBeenNthCalledWith(
        1,
        `${config.privateRuntimeConfig.lighthouseBaseURL}/plates/new`,
        {
          barcode: barcodes[0],
        }
      )
    })

    it('#for multiple barcodes on failure', async () => {
      barcodes = ['aBarcode1', 'aBarcode2']

      const response1 = {
        errors: ['foreign barcode is already in use.'],
      }

      const response2 = {
        errors: ['No samples for this barcode'],
      }

      mock.mockImplementationOnce(() => response1)
      mock.mockImplementationOnce(() => response2)

      const result = await lighthouse.createPlatesFromBarcodes({
        barcodes,
      })

      expect(result).toEqual([response1, response2])
      expect(mock).toHaveBeenCalledTimes(2)
      expect(mock).toHaveBeenNthCalledWith(
        1,
        `${config.privateRuntimeConfig.lighthouseBaseURL}/plates/new`,
        {
          barcode: barcodes[0],
        }
      )
      expect(mock).toHaveBeenNthCalledWith(
        2,
        `${config.privateRuntimeConfig.lighthouseBaseURL}/plates/new`,
        {
          barcode: barcodes[1],
        }
      )
    })

    it('#for multiple barcodes on success', async () => {
      barcodes = ['aBarcode1', 'aBarcode2']

      const response1 = {
        data: {
          plate_barcode: 'aBarcode1',
          centre: 'tst1',
          count_fit_to_pick_samples: 3,
        },
      }

      const response2 = {
        data: {
          plate_barcode: 'aBarcode2',
          centre: 'tst1',
          count_fit_to_pick_samples: 2,
        },
      }

      mock.mockImplementationOnce(() => response1)
      mock.mockImplementationOnce(() => response2)

      const result = await lighthouse.createPlatesFromBarcodes({
        barcodes,
      })

      expect(result).toEqual([response1, response2])
      expect(mock).toHaveBeenCalledTimes(2)
      expect(mock).toHaveBeenNthCalledWith(
        1,
        `${config.privateRuntimeConfig.lighthouseBaseURL}/plates/new`,
        {
          barcode: barcodes[0],
        }
      )
      expect(mock).toHaveBeenNthCalledWith(
        2,
        `${config.privateRuntimeConfig.lighthouseBaseURL}/plates/new`,
        {
          barcode: barcodes[1],
        }
      )
    })

    it('#for multiple barcodes on partial success/ failure', async () => {
      barcodes = ['aBarcode1', 'aBarcode2']

      const response1 = {
        errors: ['No samples for this barcode'],
      }

      const response2 = {
        data: {
          plate_barcode: 'aBarcode2',
          centre: 'tst1',
          count_fit_to_pick_samples: 2,
        },
      }

      mock.mockImplementationOnce(() => response1)
      mock.mockImplementationOnce(() => response2)

      const result = await lighthouse.createPlatesFromBarcodes({
        barcodes,
      })

      expect(result).toEqual([response1, response2])
      expect(mock).toHaveBeenCalledTimes(2)
      expect(mock).toHaveBeenNthCalledWith(
        1,
        `${config.privateRuntimeConfig.lighthouseBaseURL}/plates/new`,
        {
          barcode: barcodes[0],
        }
      )
      expect(mock).toHaveBeenNthCalledWith(
        2,
        `${config.privateRuntimeConfig.lighthouseBaseURL}/plates/new`,
        {
          barcode: barcodes[1],
        }
      )
    })
  })

  describe('#findPlatesFromBarcodes', () => {
    beforeEach(() => {
      mock = jest.spyOn(axios, 'get')
    })

    it('for a single barcode on success', async () => {
      const barcodes = ['aBarcode1']
      const plates = [
        {
          plate_barcode: 'aBarcode1',
          centre: 'tst1',
          count_fit_to_pick_samples: 3,
        },
      ]

      response = { data: { plates } }

      mock.mockResolvedValue(response)

      const result = await lighthouse.findPlatesFromBarcodes({
        barcodes,
      })
      const expected = { success: true, plates }

      expect(result).toEqual(expected)
      expect(mock).toHaveBeenCalledTimes(1)
      expect(mock).toHaveBeenNthCalledWith(
        1,
        `${config.privateRuntimeConfig.lighthouseBaseURL}/plates`,
        {
          params: { barcodes: barcodes[0], _exclude: 'pickable_samples' },
        }
      )
    })

    it('#for multiple barcodes on success', async () => {
      const barcodes = ['aBarcode1', 'aBarcode2']
      const plates = [
        {
          plate_barcode: 'aBarcode1',
          centre: 'tst1',
          count_fit_to_pick_samples: 3,
        },
        {
          plate_barcode: 'aBarcode2',
          centre: 'tst1',
          count_fit_to_pick_samples: 2,
        },
      ]
      response = { data: { plates } }

      mock.mockImplementationOnce(() => response)

      const result = await lighthouse.findPlatesFromBarcodes({
        barcodes,
      })
      const expected = { success: true, plates }

      expect(mock).toHaveBeenCalledTimes(1)
      expect(mock).toHaveBeenNthCalledWith(
        1,
        `${config.privateRuntimeConfig.lighthouseBaseURL}/plates`,
        {
          params: { barcodes: barcodes.join(','), _exclude: 'pickable_samples' },
        }
      )
      expect(result).toEqual(expected)
    })
  })

  describe('#getImports', () => {
    let expected

    beforeEach(() => {
      mock = jest.spyOn(axios, 'get')
    })

    it('submits the correct lighthouse query string to axios.get', async () => {
      response = await lighthouse.getImports()

      expect(mock.mock.calls).toHaveLength(1)

      const urlString = mock.mock.calls[0][0]
      const queryString = urlString.split('/imports?')[1]
      const params = new URLSearchParams(queryString)

      expect(params.get('max_results')).toBe('10000')
      expect(params.get('sort')).toBe('-date')
      expect(params.get('where')).toEqual(
        expect.stringMatching(/\{"date": \{"\$gt": "\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}"\}\}/)
      )
    })

    it('returns data successfully', async () => {
      expected = { data: { items: [] } }
      mock.mockResolvedValue(expected)
      response = await lighthouse.getImports()
      expect(response.data).toEqual(expected.data)
    })

    it('when there is an error', async () => {
      mock.mockImplementationOnce(() => Promise.reject(new Error('There was an error')))
      response = await lighthouse.getImports()
      expect(response.error).toEqual(new Error('There was an error'))
    })
  })

  describe('#deleteReports', () => {
    let expected, filenames

    beforeEach(() => {
      filenames = [
        '200716_1345_positives_with_locations.xlsx',
        '200716_1618_positives_with_locations.xlsx',
        '200716_1640_positives_with_locations.xlsx',
        '200716_1641_positives_with_locations.xlsx',
        '200716_1642_positives_with_locations.xlsx',
      ]
      mock = jest.spyOn(axios, 'post')
    })

    it('when it is successful', async () => {
      expected = { data: {} }
      mock.mockResolvedValue(expected)
      response = await lighthouse.deleteReports(filenames)
      expect(response.success).toBeTruthy()
    })

    it('when there is an error', async () => {
      mock.mockImplementationOnce(() => Promise.reject(new Error('There was an error')))
      response = await lighthouse.deleteReports()
      expect(response.success).toBeFalsy()
      expect(response.error).toEqual(new Error('There was an error'))
    })
  })

  describe('#getReports', () => {
    beforeEach(() => {
      mock = jest.spyOn(axios, 'get')
    })

    it('when the request is successful', async () => {
      axios.get.mockResolvedValue({ data: ReportsJson })

      response = await lighthouse.getReports()
      expect(response.success).toBeTruthy()
      expect(response.reports).toEqual(ReportsJson.reports)
    })

    it('when the request fails', async () => {
      axios.get.mockImplementationOnce(() => Promise.reject(new Error('There was an error')))

      response = await lighthouse.getReports()
      expect(response.success).toBeFalsy()
      expect(response.error).toEqual(new Error('There was an error'))
    })
  })

  describe('#createReport', () => {
    beforeEach(() => {
      mock = jest.spyOn(axios, 'post')
    })

    it('when the request is successful', async () => {
      axios.post.mockResolvedValue({
        data: { reports: [ReportsJson.reports[0]] },
      })
      response = await lighthouse.createReport()

      expect(response.success).toBeTruthy()
      expect(response.reports).toEqual([ReportsJson.reports[0]])
    })

    it('when the request fails', async () => {
      axios.post.mockImplementationOnce(() => Promise.reject(new Error('There was an error')))

      response = await lighthouse.createReport()

      expect(response.success).toBeFalsy()
      expect(response.error).toEqual(new Error('There was an error'))
    })
  })

  describe('#getRobots', () => {
    beforeEach(() => {
      mock = jest.spyOn(axios, 'get')
    })

    it('on success', async () => {
      response = { data: { errors: [], robots: RobotsJson.robots } }
      mock.mockResolvedValue(response)

      const result = await lighthouse.getRobots()
      const expected = { success: true, robots: RobotsJson.robots }

      expect(result).toEqual(expected)
    })

    it('on failure', async () => {
      response = {
        response: { data: { errors: ['There was an error'], robots: [] } },
      }
      mock.mockRejectedValue(response)

      const result = await lighthouse.getRobots()
      const expected = {
        success: false,
        errors: ['There was an error'],
      }

      expect(result).toEqual(expected)
    })

    it('on unknown failure', async () => {
      response = { message: 'Network Error' }
      mock.mockRejectedValue(response)

      const result = await lighthouse.getRobots()
      const expected = {
        success: false,
        errors: ['Network Error: Failed to get Robots from Lighthouse Service'],
      }

      expect(result).toEqual(expected)
    })
  })

  describe('#getFailureTypes', () => {
    beforeEach(() => {
      mock = jest.spyOn(axios, 'get')
    })

    it('when the request is successful', async () => {
      response = {
        data: { failure_types: FailureTypesJson.failure_types, errors: [] },
      }
      mock.mockResolvedValue(response)

      const result = await lighthouse.getFailureTypes()
      const expected = {
        success: true,
        failureTypes: FailureTypesJson.failure_types,
      }

      expect(result).toEqual(expected)
    })

    it('on failure', async () => {
      response = {
        response: {
          data: { errors: ['There was an error'], failure_types: [] },
        },
      }
      mock.mockRejectedValue(response)

      const result = await lighthouse.getFailureTypes()
      const expected = {
        success: false,
        errors: ['There was an error'],
      }

      expect(result).toEqual(expected)
    })

    it('on unknown failure', async () => {
      response = { message: 'Network Error' }
      mock.mockRejectedValue(response)

      const result = await lighthouse.getFailureTypes()
      const expected = {
        success: false,
        errors: ['Network Error: Failed to get Failure Types from Lighthouse Service'],
      }

      expect(result).toEqual(expected)
    })
  })

  describe('#createDestinationPlateBeckman', () => {
    let username, barcode, robotSerialNumber, form

    beforeEach(() => {
      mock = jest.spyOn(axios, 'get')
      username = 'username'
      barcode = 'aBarcode'
      robotSerialNumber = 'robot_123'
      form = {
        username,
        barcode,
        robotSerialNumber,
      }
    })

    it('on success', async () => {
      response = {
        data: {
          data: {
            plate_barcode: 'barcode',
            centre: 'centre_prefix',
            count_fit_to_pick_samples: 'len(samples)',
          },
        },
      }
      mock.mockResolvedValue(response)

      const responseData = response.data.data
      const result = await lighthouse.createDestinationPlateBeckman(form)
      const expected = {
        success: true,
        response: `Successfully created destination plate, with barcode: ${responseData.plate_barcode}, and ${responseData.count_fit_to_pick_samples} fit to pick sample(s)`,
      }
      expect(mock).toHaveBeenCalledTimes(1)
      expect(result).toEqual(expected)
      expect(mock).toHaveBeenCalledWith(
        `${config.privateRuntimeConfig.lighthouseBaseURL}/cherrypicked-plates/create?barcode=${barcode}&robot=${robotSerialNumber}&user_id=${username}`
      )
    })

    it('on failure', async () => {
      response = {
        response: { data: { errors: ['There was an error'] } },
      }
      mock.mockRejectedValue(response)

      const result = await lighthouse.createDestinationPlateBeckman(form)

      const expected = { success: false, errors: ['There was an error'] }

      expect(mock).toHaveBeenCalledTimes(1)
      expect(result).toEqual(expected)
    })
  })

  describe('#failDestinationPlateBeckman', () => {
    let username, barcode, robotSerialNumber, form, failureType

    beforeEach(() => {
      mock = jest.spyOn(axios, 'get')
      username = 'username'
      barcode = 'aBarcode'
      robotSerialNumber = 'robot_123'
      failureType = 'aType'
      form = {
        username,
        barcode,
        robotSerialNumber,
        failureType,
      }
    })

    it('on success', async () => {
      response = { data: { errors: [] } }
      mock.mockResolvedValue(response)

      const result = await lighthouse.failDestinationPlateBeckman(form)
      const expected = {
        success: true,
        response: `Successfully failed destination plate with barcode: ${barcode}`,
      }

      expect(mock).toHaveBeenCalledTimes(1)
      expect(result).toEqual(expected)
      expect(mock).toHaveBeenCalledWith(
        `${config.privateRuntimeConfig.lighthouseBaseURL}/cherrypicked-plates/fail?barcode=${barcode}&robot=${robotSerialNumber}&user_id=${username}&failure_type=${failureType}`
      )
    })

    it('on partial success', async () => {
      response = { data: { errors: ['some partial error message'] } }
      mock.mockResolvedValue(response)

      const result = await lighthouse.failDestinationPlateBeckman(form)
      const expected = { success: true, errors: ['some partial error message'] }

      expect(mock).toHaveBeenCalledTimes(1)
      expect(result).toEqual(expected)
    })

    it('on failure', async () => {
      response = {
        response: { data: { errors: ['There was an error'] } },
      }
      mock.mockRejectedValue(response)

      const result = await lighthouse.failDestinationPlateBeckman(form)

      const expected = { success: false, errors: ['There was an error'] }

      expect(mock).toHaveBeenCalledTimes(1)
      expect(result).toEqual(expected)
    })
  })

  describe('#generateTestRun', () => {
    let runId, plateSpecs

    beforeEach(() => {
      jest.spyOn(axios, 'post')
      runId = 'aRunId'
      plateSpecs = [
        { numberOfPlates: 1, numberOfPositives: 2 },
        { numberOfPlates: 3, numberOfPositives: 4 },
      ]
    })

    it('when the request is successful', async () => {
      response = { _id: runId, _status: 'OK' }

      axios.post.mockResolvedValue({
        data: response,
      })
      const result = await lighthouse.generateTestRun(plateSpecs)

      const headers = {
        headers: { Authorization: config.privateRuntimeConfig.lighthouseApiKey },
      }

      const expectedPath = /cherrypick-test-data/
      const expectedBody = {
        plate_specs: [
          [1, 2],
          [3, 4],
        ],
      }

      expect(axios.post).toHaveBeenCalledWith(
        expect.stringMatching(expectedPath),
        expectedBody,
        headers
      )
      expect(result.success).toBeTruthy()
      expect(result.runId).toEqual(runId)
    })

    it('when the request errors', async () => {
      response = {
        _status: 'ERR',
        _issues: { plate_specs: 'must be of list type', another: 'error message' },
        _error: { code: 422, message: 'Insertion failure: 1 document(s) contain(s) error(s)' },
      }
      const error = {
        response: {
          data: response,
        },
      }

      axios.post.mockImplementationOnce(() => Promise.reject(error))
      const result = await lighthouse.generateTestRun(plateSpecs)

      expect(result.success).toBeFalsy()
      expect(result.error).toBe(
        'Insertion failure: 1 document(s) contain(s) error(s): plate_specs: must be of list type; another: error message; '
      )
    })

    it('when the request fails', async () => {
      const error = {}
      axios.post.mockImplementationOnce(() => Promise.reject(error))
      const result = await lighthouse.generateTestRun(plateSpecs)

      expect(result.success).toBeFalsy()
      expect(result.error).toBe('An unexpected error has occured')
    })

    it('when the request errors, from crawler, with no _issues', async () => {
      response = { _status: 'ERR', _error: { code: 422, message: 'Insertion failure' } }
      const error = {
        response: {
          data: response,
        },
      }

      axios.post.mockImplementationOnce(() => Promise.reject(error))
      const result = await lighthouse.generateTestRun(plateSpecs)

      expect(result.success).toBeFalsy()
      expect(result.error).toBe('Insertion failure')
    })
  })

  describe('#getTestRuns', () => {
    let currentPage, maxResults

    beforeEach(() => {
      jest.spyOn(axios, 'get')
      currentPage = 1
      maxResults = 5
    })

    it('when the request is successful', async () => {
      response = {
        _items: [
          {
            _id: '1',
            plate_specs: [
              [1, 0],
              [1, 0],
              [1, 1],
            ],
            barcodes:
              '[["TEST-111", "number of positives: 0"], ["TEST-222", "number of positives: 0"], ["TEST-333", "number of positives: 2"]]',
          },
          {
            _id: '2',
            plate_specs: [
              [1, 0],
              [1, 2],
            ],
            barcodes:
              '[["TEST-444", "number of positives: 0"], ["TEST-555", "number of positives: 2"]]',
          },
          { _id: '3', plate_specs: [] },
        ],
        _meta: { total: 32 },
      }

      axios.get.mockResolvedValue({
        data: response,
      })
      const result = await lighthouse.getTestRuns(currentPage, maxResults)
      const headers = {
        headers: { Authorization: config.privateRuntimeConfig.lighthouseApiKey },
      }

      const expectedPath = /cherrypick-test-data\?max_results=5&page=1&sort=-_created/

      expect(axios.get).toHaveBeenCalledWith(expect.stringMatching(expectedPath), headers)
      expect(result.success).toBeTruthy()
      expect(result.response).toEqual(response._items)
      expect(result.response[0].total_plates).toBe(3)
      expect(result.response[1].total_plates).toBe(2)
      expect(result.response[2].total_plates).toBe(0)
      expect(result.total).toEqual(response._meta.total)
    })

    it('when the request errors', async () => {
      response = {
        _status: 'ERR',
        _error: { code: 405, message: 'The method is not allowed for the requested URL.' },
      }
      const error = {
        response: {
          data: response,
        },
      }

      axios.get.mockImplementationOnce(() => Promise.reject(error))
      const result = await lighthouse.getTestRuns(currentPage, maxResults)

      expect(result.success).toBeFalsy()
      expect(result.error).toBe('The method is not allowed for the requested URL.')
    })

    it('when the request fails', async () => {
      const error = {}
      axios.get.mockImplementationOnce(() => Promise.reject(error))
      const result = await lighthouse.getTestRuns(currentPage, maxResults)

      expect(result.success).toBeFalsy()
      expect(result.error).toBe('An unexpected error has occured')
    })
  })

  describe('#getTestRun', () => {
    let id

    beforeEach(() => {
      jest.spyOn(axios, 'get')
      id = 123
    })

    it('when the request is successful', async () => {
      response = { _id: '123', barcodes: '[["TEST-112426", "number of positives: 0"]]' }

      axios.get.mockResolvedValue({
        data: response,
      })
      const result = await lighthouse.getTestRun(id)

      const headers = {
        headers: { Authorization: config.privateRuntimeConfig.lighthouseApiKey },
      }

      const expectedPath = /cherrypick-test-data\/123/

      expect(axios.get).toHaveBeenCalledWith(expect.stringMatching(expectedPath), headers)

      expect(result.success).toBeTruthy()
      expect(result.response).toEqual(response)
    })

    it('when the request errors', async () => {
      response = {
        _status: 'ERR',
        _error: { code: 405, message: 'The method is not allowed for the requested URL.' },
      }
      const error = {
        response: {
          data: response,
        },
      }

      axios.get.mockImplementationOnce(() => Promise.reject(error))
      const result = await lighthouse.getTestRun(id)

      expect(result.success).toBeFalsy()
      expect(result.error).toBe('The method is not allowed for the requested URL.')
    })

    it('when the request fails', async () => {
      const error = {}
      axios.get.mockImplementationOnce(() => Promise.reject(error))
      const result = await lighthouse.getTestRun(id)

      expect(result.success).toBeFalsy()
      expect(result.error).toBe('An unexpected error has occured')
    })
  })

  describe('#formatPlateSpecs', () => {
    it('returns the correct format', () => {
      const result = lighthouse.formatPlateSpecs([
        { numberOfPlates: 1, numberOfPositives: 2 },
        { numberOfPlates: 3, numberOfPositives: 4 },
      ])
      expect(result).toEqual([
        [1, 2],
        [3, 4],
      ])
    })
  })
})
