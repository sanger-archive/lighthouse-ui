import axios from 'axios'
import {
  createPayloadForCherrypickBatch,
  createCherrypickBatch
} from '@/modules/sequencescape'

const config = {
  publicRuntimeConfig: {
    asynchronous: false,
    studyId: 1,
    projectId: 1
  }
}

describe('Sequencescape', () => {
  let barcodes

  beforeEach(() => {
    barcodes = ['123', '456']
  })

  describe('#createPayloadForCherrypickBatch', () => {
    let payload, payloadAttributes

    beforeEach(() => {
      payload = createPayloadForCherrypickBatch(
        barcodes,
        config.publicRuntimeConfig
      )
      payloadAttributes = payload.data.attributes
    })

    it('should have correct value for asynchronous', () => {
      expect(payloadAttributes.asynchronous).toBeFalsy()
    })

    it('should have the correct number of labware_pick_attributes', () => {
      expect(payloadAttributes.labware_pick_attributes.length).toEqual(2)
    })

    it('should have a study id, project id and barcode', () => {
      const labwarePickAttribute = payloadAttributes.labware_pick_attributes[0]
      expect(labwarePickAttribute.source_labware_barcode).toEqual(barcodes[0])
      expect(labwarePickAttribute.study_id).toBeGreaterThanOrEqual(1)
      expect(labwarePickAttribute.project_id).toBeGreaterThanOrEqual(1)
    })
  })

  describe('#createCherrypickBatch', () => {
    let mock, response, expected

    beforeEach(() => {
      mock = jest.spyOn(axios, 'post')
    })

    afterEach(() => {
      mock.mockRestore()
    })

    it('successfully', async () => {
      expected = { data: { data: 'testURL' } }
      mock.mockResolvedValue(expected)
      response = await createCherrypickBatch(barcodes)
      expect(response.data).toEqual(expected.data.data)
    })

    it('when there is an error', async () => {
      mock.mockImplementationOnce(() =>
        Promise.reject(new Error('There was an error'))
      )
      response = await createCherrypickBatch(barcodes)
      expect(response.error).toEqual(new Error('There was an error'))
    })
  })
})
