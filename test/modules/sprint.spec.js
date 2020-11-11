import axios from 'axios'
import sprint from '@/modules/sprint'
import config from '@/nuxt.config'

const layout = {
  barcodeFields: [
    {
      x: 16,
      y: 1,
      cellWidth: 0.2,
      barcodeType: 'code39',
      value: 'DN111111',
      height: 5
    }
  ],
  textFields: [
    {
      x: 3,
      y: 3,
      value: 'DN111111',
      font: 'proportional',
      fontSize: 1.7
    },
    {
      x: 57,
      y: 3,
      value: 'LHTR',
      font: 'proportional',
      fontSize: 1.7
    }
  ]
}

describe('Sprint', () => {
  it('#createLayout', () => {
    expect(sprint.createLayout('DN111111', 'DN222222')).toEqual(layout)
  })

  describe('#createBarcodes', () => {
    it('will produce a single barcode with no arguments', () => {
      expect(sprint.createBarcodes()).toEqual(['DN111111'])
    })

    it('will produce n barcodes', () => {
      expect(sprint.createBarcodes(10).length).toEqual(10)
    })
  })

  describe('#createPrintRequestBody', () => {
    it('should produce the correct json if there is a single barcode', () => {
      const body = sprint.createPrintRequestBody({
        numberOfBarcodes: 1,
        printer: 'heron-bc3'
      })
      expect(body.query).toBeDefined()
      expect(body.printer).toEqual('heron-bc3')
      expect(body.printRequest).toBeDefined()
      expect(body.printRequest.layouts[0]).toEqual(layout)
    })

    it('should produce the correct json if there are multiple barcodes', () => {
      expect(
        sprint.createPrintRequestBody({ numberOfBarcodes: 3 }).printRequest
          .layouts.length
      ).toEqual(3)
    })
  })

  describe('#printLabels', () => {
    let mock, args

    afterEach(() => {
      jest.resetAllMocks()
    })

    beforeEach(() => {
      mock = jest.spyOn(axios, 'post')
      args = { numberOfBarcodes: 10, printer: 'heron-bc3' }
    })

    it('successfully', async () => {
      mock.mockResolvedValue({})
      const response = await sprint.printLabels(args)
      expect(mock).toHaveBeenCalledWith(
        config.privateRuntimeConfig.sprintBaseURL,
        sprint.createPrintRequestBody(args),
        sprint.headers
      )
      expect(response.success).toBeTruthy()
      expect(response.message).toEqual(
        'successfully printed 10 labels to heron-bc3'
      )
    })

    it('unsuccessfully', async () => {
      mock.mockImplementation(() =>
        Promise.reject(new Error('There was an error'))
      )
      const response = await sprint.printLabels(args)
      expect(response.success).toBeFalsy()
      expect(response.error).toEqual(new Error('There was an error'))
    })
  })
})
