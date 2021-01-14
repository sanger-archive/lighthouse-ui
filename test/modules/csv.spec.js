import fs from 'fs'
import csv from '@/modules/csv'
import barcodes from '@/test/data/barcodes'

describe('csv', () => {
  let file

  beforeEach(() => {
    const readFile = fs.readFileSync('./test/data/barcodes.csv', 'ascii')
    file = new File([readFile], 'barcodes.csv', { type: 'text/csv' })
  })

  it('#read', async () => {
    const result = await csv.read(file)
    expect(result).toBeDefined()
  })

  it('#parse', async () => {
    const result = await csv.read(file)
    const json = csv.parse(result)
    expect(json).toEqual(barcodes)
  })
})
