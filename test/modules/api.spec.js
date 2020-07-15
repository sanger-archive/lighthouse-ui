import getLabwhere from '@/modules/labwhere'
import * as methods from '@/modules/api'

describe('api', () => {
  it('works', () => {
    expect(methods.getLabwhere()).toEqual('labwhere')
  })
})