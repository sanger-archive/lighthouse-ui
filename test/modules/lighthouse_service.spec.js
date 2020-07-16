import axios from 'axios'
import * as Modules from '@/modules/lighthouse_service'

describe('lighthouse_service api', () => {
  describe('#createPlatesFromBarcodes ', () => {
    let mock, plateBarcodes, response

    beforeEach(() => {
      mock = jest.spyOn(axios, 'post')
    })

    afterEach(() => {
      mock.mockRestore()
    })

    it('for a single barcode on failure', async () => {
      plateBarcodes = ['aBarcode1']

      response = {
        errors: ['foreign barcode is already in use.']
      }

      mock.mockResolvedValue(response)

      const result = await Modules.createPlatesFromBarcodes({
        plateBarcodes
      })

      expect(result).toEqual([response])
      expect(mock).toHaveBeenCalledTimes(1)
      expect(mock).toHaveBeenNthCalledWith(
        1,
        'http://localhost:5000/plates/new',
        { barcode: plateBarcodes[0] }
      )
    })

    it('for a single barcode on success', async () => {
      plateBarcodes = ['aBarcode1']

      response = {
        data: {
          attributes: {
            uuid: 'ce649e2e-c751-11ea-93a9-fa163e68e77d',
            purpose_name: 'LHR Stock',
            study_names: ['Heron Project']
          },
          links: {
            self:
              'http://uat.sequencescape.psd.sanger.ac.uk/api/v2/plates/26485889'
          }
        }
      }

      mock.mockResolvedValue(response)

      const result = await Modules.createPlatesFromBarcodes({
        plateBarcodes
      })

      expect(result).toEqual([response])
      expect(mock).toHaveBeenCalledTimes(1)
      expect(mock).toHaveBeenNthCalledWith(
        1,
        'http://localhost:5000/plates/new',
        { barcode: plateBarcodes[0] }
      )
    })

    it('#for multiple barcodes on failure', async () => {
      plateBarcodes = ['aBarcode1', 'aBarcode2']

      const response1 = {
        errors: ['foreign barcode is already in use.']
      }

      const response2 = {
        errors: ['sample does not exist.']
      }

      mock.mockImplementationOnce(() => response1)
      mock.mockImplementationOnce(() => response2)

      const result = await Modules.createPlatesFromBarcodes({
        plateBarcodes
      })

      expect(result).toEqual([response1, response2])
      expect(mock).toHaveBeenCalledTimes(2)
      expect(mock).toHaveBeenNthCalledWith(
        1,
        'http://localhost:5000/plates/new',
        { barcode: plateBarcodes[0] }
      )
      expect(mock).toHaveBeenNthCalledWith(
        2,
        'http://localhost:5000/plates/new',
        { barcode: plateBarcodes[1] }
      )
    })

    it('#for multiple barcodes on success', async () => {
      plateBarcodes = ['aBarcode1', 'aBarcode2']

      const response1 = {
        data: {
          attributes: {
            uuid: '11111-111-1111-1111-111111111',
            purpose_name: 'LHR Stock',
            study_names: ['Heron Project']
          },
          links: {
            self: 'http://uat.sequencescape.psd.sanger.ac.uk/api/v2/plates/1'
          }
        }
      }

      const response2 = {
        data: {
          attributes: {
            uuid: '22222-2222-2222-2222-222222222',
            purpose_name: 'LHR Stock',
            study_names: ['Heron Project']
          },
          links: {
            self: 'http://uat.sequencescape.psd.sanger.ac.uk/api/v2/plates/2'
          }
        }
      }

      mock.mockImplementationOnce(() => response1)
      mock.mockImplementationOnce(() => response2)

      const result = await Modules.createPlatesFromBarcodes({
        plateBarcodes
      })

      expect(result).toEqual([response1, response2])
      expect(mock).toHaveBeenCalledTimes(2)
      expect(mock).toHaveBeenNthCalledWith(
        1,
        'http://localhost:5000/plates/new',
        { barcode: plateBarcodes[0] }
      )
      expect(mock).toHaveBeenNthCalledWith(
        2,
        'http://localhost:5000/plates/new',
        { barcode: plateBarcodes[1] }
      )
    })

    it('#for multiple barcodes on partial success/ failure', async () => {
      plateBarcodes = ['aBarcode1', 'aBarcode2']

      const response1 = {
        errors: ['foreign barcode is already in use.']
      }

      const response2 = {
        data: {
          attributes: {
            uuid: '22222-2222-2222-2222-222222222',
            purpose_name: 'LHR Stock',
            study_names: ['Heron Project']
          },
          links: {
            self: 'http://uat.sequencescape.psd.sanger.ac.uk/api/v2/plates/2'
          }
        }
      }

      mock.mockImplementationOnce(() => response1)
      mock.mockImplementationOnce(() => response2)

      const result = await Modules.createPlatesFromBarcodes({
        plateBarcodes
      })

      expect(result).toEqual([response1, response2])
      expect(mock).toHaveBeenCalledTimes(2)
      expect(mock).toHaveBeenNthCalledWith(
        1,
        'http://localhost:5000/plates/new',
        { barcode: plateBarcodes[0] }
      )
      expect(mock).toHaveBeenNthCalledWith(
        2,
        'http://localhost:5000/plates/new',
        { barcode: plateBarcodes[1] }
      )
    })
  })
})
