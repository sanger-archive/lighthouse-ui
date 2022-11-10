import axios from 'axios'
import PrintLabels, { createLayout, createPrintRequestBody } from '@/modules/sprint_reagent_aliquot_labels'
import config from '@/nuxt.config'
import { headers as SprintHeaders } from '@/modules/sprint_constants'

// TODO: move out into helper
const errorResponse = new Error('There was an error')
const rejectPromise = () => Promise.reject(errorResponse)

const layout = {
  barcodeFields: [
    {
      x: 39,
      y: 1,
      cellWidth: 0.2,
      barcodeType: 'code39',
      value: 'DN111111',
      height: 4,
    },
  ],
  textFields: [
    {
      x: 3,
      y: 4,
      value: 'First line of text',
      font: 'proportional',
      fontSize: 2.3,
    },
    {
      x: 3,
      y: 7,
      value: 'Second line of text',
      font: 'proportional',
      fontSize: 2.3,
    },
  ],
}

const labelFields = {
  barcode: 'DN111111',
  firstText: 'First line of text',
  secondText: 'Second line of text',
}

const printer = 'heron-bc3'

describe('Sprint module', () => {
  describe('#createLayout', () => {
    it('generates the correct layout', () => {
      expect(createLayout(labelFields)).toEqual(layout)
    })
  })

  describe('#createPrintRequestBody', () => {
    it('should produce the correct json if there is a single quantity', () => {
      const body = createPrintRequestBody({
        ...labelFields,
        printer,
        quantity: 1,
      })

      expect(body.query).toBeDefined()
      const variables = body.variables
      expect(variables).toBeDefined()
      expect(variables.printer).toBe(printer)
      expect(variables.printRequest).toBeDefined()
      expect(variables.printRequest.layouts).toBeDefined()
      expect(variables.printRequest.layouts).toHaveLength(1)
      expect(variables.printRequest.layouts[0]).toEqual(layout)
    })

    it('should produce the correct json if there are multiple barcodes', () => {
      const body = createPrintRequestBody({
        ...labelFields,
        printer,
        quantity: 5,
      })

      expect(body.variables.printRequest.layouts).toHaveLength(5)
      body.variables.printRequest.layouts.forEach((bodyLayout) => {
        expect(bodyLayout).toEqual(layout)
      })
    })
  })

  describe('#printLabels', () => {
    const baseArgs = { ...labelFields, printer }
    let mockAxios

    beforeEach(() => {
      mockAxios = jest.spyOn(axios, 'post')
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    it.each([[1, 'label'], [5, 'labels'], [10, 'labels']])
        ('calls axios correctly with quantity = %s', async (quantity, labelsString) => {
      mockAxios.mockResolvedValue({
        data: {
          print: {
            jobId: 'heron-bc3:eb5a7d75-2510-4355-a3c1-33c1ce8742ba',
          },
        },
      })

      const args = { ...baseArgs, quantity }
      const response = await PrintLabels(args)

      expect(mockAxios).toHaveBeenCalledWith(
        config.privateRuntimeConfig.sprintBaseURL,
        createPrintRequestBody(args),
        SprintHeaders
      )
      expect(response.success).toBeTruthy()
      expect(response.message).toBe(`Successfully printed ${quantity} ${labelsString} to heron-bc3`)
    })

    it.each([-5, 0, 101, NaN, 'banana'])
        ("returns unsuccessful where quantity '%s' is invalid", async (quantity) => {
      const args = { ...baseArgs, quantity }
      const response = await PrintLabels(args)

      expect(response.success).toBeFalsy()
      expect(response.error).toEqual(new Error('Quantity should be between 1 and 100.'))
    })

    it('return unsuccessful when sprint fails', async () => {
      mockAxios.mockImplementation(() => rejectPromise())

      const args = { ...baseArgs, quantity: 1 }
      const response = await PrintLabels(args)

      expect(response.success).toBeFalsy()
      expect(response.error).toEqual(errorResponse)
    })

    it('returns unsuccessful when sprint returns an error', async () => {
      mockAxios.mockResolvedValue({
        data: {
          errors: [
            {
              message:
                'Exception while fetching data (/print) : Unknown printer without explicit printer type: bug',
            },
          ],
        },
      })

      const args = { ...baseArgs, quantity: 1 }
      const response = await PrintLabels(args)

      expect(response.success).toBeFalsy()
      expect(response.error).toEqual(
        new Error(
          'Exception while fetching data (/print) : Unknown printer without explicit printer type: bug'
        )
      )
    })
  })
})
