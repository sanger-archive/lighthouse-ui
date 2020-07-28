import axios from 'axios'
import { createCherrypickBatch } from '@/modules/sequencescape'

describe('Sequencescape', () => {
  describe('#createCherrypickBatch', () => {
    let labwareBarcodes, mock, response, expected

    beforeEach(() => {
      mock = jest.spyOn(axios, 'post')
      labwareBarcodes = ['123', '456']
    })

    afterEach(() => {
      mock.mockRestore()
    })

    it('successfully', async () => {
      expected = { data: { data: 'testURL' } }
      mock.mockResolvedValue(expected)
      response = await createCherrypickBatch(labwareBarcodes)
      expect(response.data).toEqual(expected.data.data)
    })

    it('when there is an error', async () => {
      mock.mockImplementationOnce(() =>
        Promise.reject(new Error('There was an error'))
      )
      response = await createCherrypickBatch(labwareBarcodes)
      expect(response.error).toEqual(new Error('There was an error'))
    })
  })
})
