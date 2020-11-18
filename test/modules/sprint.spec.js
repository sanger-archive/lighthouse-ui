import axios from 'axios'
import Sprint from '@/modules/sprint'
import Baracoda from '@/modules/baracoda'
import config from '@/nuxt.config'

jest.mock('@/modules/baracoda')

// TODO: move out into helper
const errorResponse = new Error('There was an error')
const rejectPromise = () => Promise.reject(errorResponse)

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
    expect(Sprint.createLayout('DN111111', 'DN222222')).toEqual(layout)
  })

  describe('#createBarcodes', () => {
    it('will produce a single barcode with no arguments', () => {
      expect(Sprint.createBarcodes()).toEqual(['DN111111'])
    })

    it('will produce n barcodes', () => {
      expect(Sprint.createBarcodes(10).length).toEqual(10)
    })
  })

  describe('#createPrintRequestBody', () => {
    it('should produce the correct json if there is a single barcode', () => {
      const body = Sprint.createPrintRequestBody({
        barcodes: ['DN111111'],
        printer: 'heron-bc3'
      })
      expect(body.query).toBeDefined()
      expect(body.printer).toEqual('heron-bc3')
      expect(body.printRequest).toBeDefined()
      expect(body.printRequest.layouts[0]).toEqual(layout)
    })

    it('should produce the correct json if there are multiple barcodes', () => {
      expect(
        Sprint.createPrintRequestBody({
          barcodes: ['DN111111', 'DN222222', 'DN333333']
        }).printRequest.layouts.length
      ).toEqual(3)
    })
  })

  describe('#printLabels', () => {
    let mock, args, barcodes

    afterEach(() => {
      jest.resetAllMocks()
    })

    beforeEach(() => {
      mock = jest.spyOn(axios, 'post')
      args = { numberOfBarcodes: 5, printer: 'heron-bc3' }
      barcodes = [
        'HT-111116',
        'HT-111117',
        'HT-111118',
        'HT-111119',
        'HT-111120'
      ]
    })

    it('successfully', async () => {
      Baracoda.createBarcodes.mockResolvedValue(barcodes)
      mock.mockResolvedValue({})
      const response = await Sprint.printLabels(args)
      expect(mock).toHaveBeenCalledWith(
        config.privateRuntimeConfig.sprintBaseURL,
        Sprint.createPrintRequestBody({ ...args, barcodes }),
        Sprint.headers
      )
      expect(response.success).toBeTruthy()
      expect(response.message).toEqual(
        'successfully printed 5 labels to heron-bc3'
      )
    })

    it('when baracoda fails', async () => {
      Baracoda.createBarcodes.mockImplementation(() => rejectPromise())
      const response = await Sprint.printLabels(args)
      expect(response.success).toBeFalsy()
      expect(response.error).toEqual(errorResponse)
    })

    it('when sprint fails', async () => {
      Baracoda.createBarcodes.mockResolvedValue(barcodes)
      mock.mockImplementation(() => rejectPromise())
      const response = await Sprint.printLabels(args)
      expect(response.success).toBeFalsy()
      expect(response.error).toEqual(errorResponse)
    })
  })
})
