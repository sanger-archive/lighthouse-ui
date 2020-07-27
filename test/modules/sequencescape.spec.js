import axios from 'axios'
import { createCherrypickBatch } from '@/modules/sequencescape'

describe('Sequencescape', () => {
  describe('#createCherrypickBatch', () => {
    let labwareBarcodes, mock, response, batchURL

    beforeEach(() => {
      mock = jest.spyOn(axios, 'post')
      labwareBarcodes = ['123', '456']
    })

    afterEach(() => {
      mock.mockRestore()
    })

    it('successfully', async () => {
      response = { data: 'testURL' }
      mock.mockResolvedValue(response)

      batchURL = await createCherrypickBatch(labwareBarcodes)
      expect(batchURL).toEqual(response)
    })

    it('when there is an error', async () => {
      mock.mockImplementationOnce(() =>
        Promise.reject(new Error('There was an error'))
      )
      batchURL = await createCherrypickBatch(labwareBarcodes)
      expect(batchURL).toEqual(new Error('There was an error'))
    })
  })
})
