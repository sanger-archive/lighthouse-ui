import axios from 'axios'
import { sourcePlate, destinationPlate } from '../data/biosero_plates'
import lighthouseBiosero from '@/modules/lighthouse_service_biosero'
import config from '@/nuxt.config'

describe('lighthouse_service_biosero api', () => {
  let mock, response

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('#createDestinationPlateBiosero', () => {
    let username, barcode, form

    beforeEach(() => {
      mock = jest.spyOn(axios, 'post')
      username = 'username'
      barcode = 'aBarcode'
      form = {
        username,
        barcode,
      }
    })

    it('on success', async () => {
      response = {
        status: 201,
      }
      mock.mockResolvedValue(response)

      const result = await lighthouseBiosero.createDestinationPlateBiosero(form)
      const expected = {
        success: true,
        response: `Successfully created destination plate with barcode: ${barcode}`,
      }
      expect(mock).toHaveBeenCalledTimes(1)
      expect(result).toEqual(expected)
      expect(mock).toHaveBeenCalledWith(
        `${config.privateRuntimeConfig.lighthouseBaseURL}/events`,
        {
          barcode,
          user_id: username,
          event_type: 'lh_biosero_cp_destination_plate_partial_completed',
        },
        {
          headers: {
            Authorization: config.privateRuntimeConfig.lighthouseApiKey,
          },
        }
      )
    })

    it('on failure with unexpected status code', async () => {
      const response = {
        data: {
          _status: 'ERR',
          _error: {
            code: 422,
            message: 'There was an error',
          },
        },
      }
      mock.mockResolvedValue(response)

      const result = await lighthouseBiosero.createDestinationPlateBiosero(form)

      const expected = {
        success: false,
        error: {
          code: 422,
          message: 'There was an error',
        },
      }

      expect(mock).toHaveBeenCalledTimes(1)
      expect(result).toEqual(expected)
    })

    it('on failure with exception', async () => {
      const errorResponse = new Error('There was an error')

      mock.mockRejectedValue(errorResponse)

      const result = await lighthouseBiosero.createDestinationPlateBiosero(form)

      expect(mock).toHaveBeenCalledTimes(1)
      expect(result.success).toEqual(false)
      expect(result.error).toEqual(errorResponse)
    })
  })

  describe('#failDestinationPlateBiosero', () => {
    let username, barcode, form, failureType

    beforeEach(() => {
      mock = jest.spyOn(axios, 'post')
      username = 'username'
      barcode = 'aBarcode'
      failureType = 'aType'
      form = {
        username,
        barcode,
        failureType,
      }
    })

    it('on success', async () => {
      response = {
        _status: 'OK',
      }
      mock.mockResolvedValue(response)

      const result = await lighthouseBiosero.failDestinationPlateBiosero(form)
      const expected = {
        success: true,
        response: `Successfully failed destination plate with barcode: ${barcode}`,
      }

      expect(mock).toHaveBeenCalledTimes(1)
      expect(result).toEqual(expected)
      expect(mock).toHaveBeenCalledWith(
        `${config.privateRuntimeConfig.lighthouseBaseURL}/events`,
        {
          barcode,
          user_id: username,
          event_type: 'lh_biosero_cp_destination_plate_failed',
          failure_type: failureType,
        },
        {
          headers: {
            Authorization: config.privateRuntimeConfig.lighthouseApiKey,
          },
        }
      )
    })

    it('on failure with unexpected status code', async () => {
      response = {
        _status: 'ERR',
        _error: {
          code: 422,
          message: 'some error message',
        },
      }
      mock.mockResolvedValue(response)

      const result = await lighthouseBiosero.failDestinationPlateBiosero(form)
      const expected = {
        success: false,
        errors: {
          code: 422,
          message: 'some error message',
        },
      }

      expect(mock).toHaveBeenCalledTimes(1)
      expect(result).toEqual(expected)
    })

    it('on failure with exception', async () => {
      const errorResponse = new Error('some error message')

      mock.mockRejectedValue(errorResponse)

      const result = await lighthouseBiosero.failDestinationPlateBiosero(form)

      expect(mock).toHaveBeenCalledTimes(1)
      expect(result.success).toEqual(false)
      expect(result.error).toEqual(errorResponse)
    })
  })

  describe('#getBioseroPlate', () => {
    let mockGet, destinationPlateBarcode, sourcePlateBarcode, response, mockResponse

    beforeEach(() => {
      mockGet = jest.spyOn(axios, 'get')
      destinationPlateBarcode = 'DN1'
      sourcePlateBarcode = '12345'
    })

    afterEach(() => {
      mockGet.mockRestore()
    })

    it('successfully gets source plates', async () => {
      mockResponse = { data: { plate: { data: sourcePlate } } }
      mockGet.mockResolvedValue(mockResponse)

      response = await lighthouseBiosero.getBioseroPlate(sourcePlateBarcode, 'source')

      expect(response.success).toBeTruthy()
      expect(response.source).toBeTruthy()
      expect(response.barcode).toEqual(sourcePlate.barcode)
      expect(response.samples).toEqual(sourcePlate.samples)
    })

    it('successfully gets destination plates', async () => {
      mockResponse = { data: { plate: { data: destinationPlate } } }
      mockGet.mockResolvedValue(mockResponse)

      response = await lighthouseBiosero.getBioseroPlate(destinationPlateBarcode, 'destination')

      expect(response.success).toBeTruthy()
      expect(response.destination).toBeTruthy()
      expect(response.barcode).toEqual(destinationPlate.barcode)
      expect(response.samples).toEqual(destinationPlate.samples)
    })

    it('when there is an error', async () => {
      mockGet.mockImplementationOnce(() => Promise.reject(new Error('There was an error')))

      response = await lighthouseBiosero.getBioseroPlate(destinationPlateBarcode, 'destination')

      expect(response.success).toBeFalsy()
      expect(response.barcode).not.toBeDefined()
      expect(response.samples).not.toBeDefined()
    })
  })
})
