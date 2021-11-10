import axios from 'axios'
import cherrytrack from '@/modules/cherrytrack'
import { sourcePlate, destinationPlate } from '../data/cherrytrack_plates'

describe('Cherrytrack', () => {
  let plateBarcode, response, mockGet, mockResponse

  beforeEach(() => {
    mockGet = jest.spyOn(axios, 'get')
  })

  afterEach(() => {
    mockGet.mockRestore()
  })

  describe('#getSourcePlate', () => {
    plateBarcode = sourcePlate.barcode

    it('successfully', async () => {
      mockResponse = { data: { data: sourcePlate } }
      mockGet.mockResolvedValue(mockResponse)

      response = await cherrytrack.getSourcePlate(plateBarcode)

      expect(response.success).toBeTruthy()
      expect(response.source).toBeTruthy()
      expect(response.barcode).toEqual(sourcePlate.barcode)
      expect(response.samples).toEqual(sourcePlate.samples)
    })

    it('when there is an error', async () => {
      mockGet.mockImplementationOnce(() => Promise.reject(new Error('There was an error')))

      response = await cherrytrack.getSourcePlate(plateBarcode)

      expect(response.success).toBeFalsy()
      expect(response.barcode).not.toBeDefined()
      expect(response.samples).not.toBeDefined()
    })
  })

  describe('#getDestinationPlate', () => {
    plateBarcode = destinationPlate.barcode

    it('successfully', async () => {
      mockResponse = { data: { data: destinationPlate } }
      mockGet.mockResolvedValue(mockResponse)

      response = await cherrytrack.getDestinationPlate(plateBarcode)

      expect(response.success).toBeTruthy()
      expect(response.destination).toBeTruthy()
      expect(response.barcode).toEqual(destinationPlate.barcode)
      expect(response.wells).toEqual(destinationPlate.wells)
    })

    it('when there is an error', async () => {
      mockGet.mockImplementationOnce(() => Promise.reject(new Error('There was an error')))

      response = await cherrytrack.getDestinationPlate(plateBarcode)

      expect(response.success).toBeFalsy()
      expect(response.barcode).not.toBeDefined()
      expect(response.wells).not.toBeDefined()
    })
  })
})
