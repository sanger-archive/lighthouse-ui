import { BootstrapVue } from 'bootstrap-vue'
import { mount, createLocalVue } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import BoxBuster from '@/pages/box_buster.vue'
import labwhere from '@/modules/labwhere'
import lighthouse from '@/modules/lighthouse_service'

// Mock the whole module. Returning jest.fn() allows you to mock methods here
// jest.mock('@/modules/labwhere', () => jest.fn())
jest.mock('@/modules/labwhere')
jest.mock('@/modules/lighthouse_service')

// When rendering HTML browsers compress whitespace
// When writing tests, we are more concerned with what the users sees, and
// don't really care about additional whitespace introduced due to the
// layout of our templates. This compresses all whitespace down.
const squish = (text) => text.replace(/\s+/g, ' ')

const localVue = createLocalVue()

// List of example plates to use in testing.
const plateA = {
  plate_barcode: 'AP-rna-1-8-posi',
  plate_map: true,
  number_of_positives: 8,
  must_sequence: false,
  preferentially_sequence: false,
}
const plateB = {
  plate_barcode: 'AP-rna-2-2-posi',
  plate_map: true,
  number_of_positives: 2,
  must_sequence: false,
  preferentially_sequence: true,
}
const plateC = {
  plate_barcode: 'AP-rna-3-0-nmap',
  plate_map: false,
  number_of_positives: null,
  must_sequence: false,
  preferentially_sequence: false,
}
const plateD = {
  plate_barcode: 'AP-rna-4-5-posi',
  plate_map: true,
  number_of_positives: 5,
  must_sequence: true,
  preferentially_sequence: true,
}
const plateE = {
  plate_barcode: 'AP-rna-5-0-posi',
  plate_map: true,
  number_of_positives: 0,
  must_sequence: false,
  preferentially_sequence: true,
}
const plateF = {
  plate_barcode: 'AP-rna-6-2-posi',
  plate_map: true,
  number_of_positives: 10,
  must_sequence: true,
  preferentially_sequence: false,
}
const examplePlates = [plateA, plateB, plateC, plateD, plateE, plateF]
const expectedPlateTotal = 6
const expectedMapTotal = 5
const expectedMaplessTotal = 1
const expectedPositiveTotal = 25
const expectedMustSequence = 2
const expectedPreferentiallySequence = 3

localVue.use(BootstrapVue)

describe('BoxBuster', () => {
  let wrapper

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('is a Vue instance', () => {
    const wrapper = mount(BoxBuster, { localVue })
    expect(wrapper.findComponent(BoxBuster).exists()).toBeTruthy()
  })

  it('renders a list of plates', async () => {
    const data = { plates: examplePlates }
    const wrapper = mount(BoxBuster, { localVue })
    await wrapper.setData(data)
    const tableText = wrapper.find('table').text()
    expect(tableText).toContain('AP-rna-1-8-posi')
    expect(tableText).toContain('AP-rna-4-5-posi')
    expect(tableText).toContain('AP-rna-2-2-posi')
    expect(tableText).toContain('AP-rna-3-0-nmap')
    expect(tableText).toContain('AP-rna-6-2-posi')
  })

  it('shows a table with the expected headers', async () => {
    const wrapper = mount(BoxBuster, { localVue })
    await wrapper.setData({ labwhereResponse: { success: true } })
    const header = wrapper.find('table').findAll('th')
    expect(header.at(0).text()).toContain('Barcode')
    expect(header.at(1).text()).toContain('Plate Map')
    expect(header.at(2).text()).toContain('Number Of Positives')
    expect(header.at(3).text()).toContain('Must Sequence')
    expect(header.at(4).text()).toContain('Preferentially Sequence')
  })

  it("only shows the table once we've scanned the Box", async () => {
    const wrapper = mount(BoxBuster, { localVue })
    await wrapper.setData({ labwhereResponse: { success: null } })
    expect(wrapper.find('table').exists()).toBe(false)
  })

  it('sorts list of plates by must_sequence', async () => {
    wrapper = mount(BoxBuster, { localVue })
    const sortedExamplePlates = wrapper.vm.sortedPlates(examplePlates)
    const data = { plates: sortedExamplePlates }
    await wrapper.setData(data)
    const rows = wrapper.find('table').findAll('tr')
    expect(rows.at(1).text()).toMatch(/AP-rna-4-5-posi/)
    expect(rows.at(2).text()).toMatch(/AP-rna-6-2-posi/)
    expect(rows.at(3).text()).toMatch(/AP-rna-2-2-posi/)
    expect(rows.at(4).text()).toMatch(/AP-rna-5-0-posi/)
    expect(rows.at(5).text()).toMatch(/AP-rna-1-8-posi/)
    expect(rows.at(6).text()).toMatch(/AP-rna-3-0-nmap/)
  })

  it('renders a summary of plates', async () => {
    const data = { plates: examplePlates }
    const expected = squish(`Box Summary: Total of ${expectedPlateTotal} plates in box;
    ${expectedMapTotal} plates with plates maps,
    ${expectedMaplessTotal} without.
    Total ${expectedPositiveTotal} positives.
    Box further contains: ${expectedMustSequence} plates with samples that must be sequenced;
    ${expectedPreferentiallySequence} plates of samples that we should preferentially sequence.
    Sorted by: 1. Must Sequence 2. Preferentially Sequence 3. Number of Positives`)
    wrapper = mount(BoxBuster, { localVue })
    await wrapper.setData(data)
    const summary = squish(wrapper.find('caption').text())
    expect(summary).toBe(expected)
  })

  it('makes it easy to see when plates have a plate map', async () => {
    const data = { plates: [plateA] }
    wrapper = mount(BoxBuster, { localVue })
    await wrapper.setData(data)
    const row = wrapper.find('table').findAll('tr').at(1)
    expect(row.text()).toBe('AP-rna-1-8-posiYes8NoNo')
    expect(row.classes()).toContain('table-success')
  })

  it('makes it easy to see when plates do not have a plate map', async () => {
    const data = { plates: [plateC] }
    wrapper = mount(BoxBuster, { localVue })
    await wrapper.setData(data)
    const row = wrapper.find('table').findAll('tr').at(1)
    expect(row.text()).toBe('AP-rna-3-0-nmapNoN/ANoNo')
    expect(row.classes()).toContain('table-danger')
  })

  it('lets the user know if the box is empty', async () => {
    labwhere.getPlatesFromBoxBarcodes.mockResolvedValue({
      success: false,
      error: 'The box has no plates',
    })
    lighthouse.findPlatesFromBarcodes.mockResolvedValue({
      success: true,
      plates: [],
    })
    wrapper = mount(BoxBuster, { localVue })
    const barcodeField = wrapper.find('#box-barcode-field')
    barcodeField.setValue('12345')
    await barcodeField.trigger('change')
    await flushPromises()
    expect(wrapper.text()).toContain('The box has no plates')
  })

  it('lets the user know if labwhere errors', async () => {
    labwhere.getPlatesFromBoxBarcodes.mockResolvedValue({
      success: false,
      error: new Error('Server Error'),
    })
    lighthouse.findPlatesFromBarcodes.mockResolvedValue({
      success: true,
      plates: [],
    })
    wrapper = mount(BoxBuster, { localVue })
    const barcodeField = wrapper.find('#box-barcode-field')
    barcodeField.setValue('12345')
    await barcodeField.trigger('change')
    await flushPromises()
    expect(wrapper.text()).toContain('Server Error')
  })

  describe('#findBox', () => {
    it('will not look up empty barcodes', async () => {
      wrapper = mount(BoxBuster, { localVue })
      const barcodeField = wrapper.find('#box-barcode-field')
      barcodeField.setValue('')
      await barcodeField.trigger('change')
      await flushPromises()
      expect(labwhere.getPlatesFromBoxBarcodes).not.toHaveBeenCalled()
    })

    it('looks up barcodes in labwhere', async () => {
      const barcodes = [
        'AP-rna-1-8-posi',
        'AP-rna-2-2-posi',
        'AP-rna-3-0-nmap',
        'AP-rna-4-5-posi',
        'AP-rna-5-0-posi',
        'AP-rna-6-2-posi',
      ]
      labwhere.getPlatesFromBoxBarcodes.mockResolvedValue({
        success: true,
        barcodes,
      })
      lighthouse.findPlatesFromBarcodes.mockResolvedValue({
        success: true,
        plates: [],
      })
      wrapper = mount(BoxBuster, { localVue })
      const barcodeField = wrapper.find('#box-barcode-field')
      barcodeField.setValue('12345')
      await barcodeField.trigger('change')
      await flushPromises()
      expect(wrapper.text()).toContain('Box found')
      expect(labwhere.getPlatesFromBoxBarcodes).toHaveBeenCalledWith('12345')
    })

    it('looks up plates in lighthouse', async () => {
      const barcodes = [
        'AP-rna-1-8-posi',
        'AP-rna-2-2-posi',
        'AP-rna-3-0-nmap',
        'AP-rna-4-5-posi',
        'AP-rna-5-0-posi',
        'AP-rna-6-2-posi',
      ]
      labwhere.getPlatesFromBoxBarcodes.mockResolvedValue({
        success: true,
        barcodes,
      })
      lighthouse.findPlatesFromBarcodes.mockResolvedValue({
        success: true,
        plates: [],
      })
      wrapper = mount(BoxBuster, { localVue })
      const barcodeField = wrapper.find('#box-barcode-field')
      barcodeField.setValue('12345')
      await barcodeField.trigger('change')
      await flushPromises()
      expect(lighthouse.findPlatesFromBarcodes).toHaveBeenCalledWith({
        success: true,
        barcodes,
      })
    })

    it('falls back to a plate lookup if there appears to be no box', async () => {
      labwhere.getPlatesFromBoxBarcodes.mockResolvedValue({
        success: false,
        error: new Error('Server Error'),
      })
      lighthouse.findPlatesFromBarcodes.mockResolvedValue({
        success: true,
        plates: [],
      })
      wrapper = mount(BoxBuster, { localVue })
      const barcodeField = wrapper.find('#box-barcode-field')
      barcodeField.setValue('12345')
      await barcodeField.trigger('change')
      await flushPromises()
      expect(lighthouse.findPlatesFromBarcodes).toHaveBeenCalledWith({
        barcodes: ['12345'],
      })
    })
  })

  describe('#findPlates', () => {
    it('populates plates from lighthouse', async () => {
      const barcodes = [
        'AP-rna-1-8-posi',
        'AP-rna-2-2-posi',
        'AP-rna-3-0-nmap',
        'AP-rna-4-5-posi',
        'AP-rna-5-0-posi',
        'AP-rna-6-2-posi',
      ]
      lighthouse.findPlatesFromBarcodes.mockResolvedValue({
        success: true,
        plates: examplePlates,
      })
      wrapper = mount(BoxBuster, { localVue })
      const expectedSortedPlates = wrapper.vm.sortedPlates(examplePlates)
      wrapper.vm.sortedPlates = jest.fn()
      wrapper.vm.sortedPlates.mockReturnValue(expectedSortedPlates)
      wrapper.vm.findPlates({ success: true, barcodes })
      await flushPromises()
      expect(lighthouse.findPlatesFromBarcodes).toHaveBeenCalledWith({
        success: true,
        barcodes,
      })
      expect(wrapper.vm.sortedPlates).toHaveBeenCalledWith(examplePlates)
      expect(wrapper.vm.plates).toEqual(expectedSortedPlates)
    })

    it('findPlatesFromBarcodes can be sucessful and return no plates', async () => {
      const barcodes = ['AP-rna-1-8-posi']
      lighthouse.findPlatesFromBarcodes.mockResolvedValue({
        success: true,
        plates: [],
      })
      wrapper = mount(BoxBuster, { localVue })
      wrapper.vm.findPlates({ success: true, barcodes })
      await flushPromises()
      expect(lighthouse.findPlatesFromBarcodes).toHaveBeenCalledWith({
        success: true,
        barcodes,
      })
      expect(wrapper.vm.plates).toEqual([])
    })

    it('displays lighthouse errors', async () => {
      const barcodes = [
        'AP-rna-1-8-posi',
        'AP-rna-2-2-posi',
        'AP-rna-3-0-nmap',
        'AP-rna-4-5-posi',
        'AP-rna-5-0-posi',
        'AP-rna-6-2-posi',
      ]
      lighthouse.findPlatesFromBarcodes.mockResolvedValue({
        success: false,
        error: new Error('Lighthouse error'),
      })
      wrapper = mount(BoxBuster, { localVue })
      wrapper.vm.sortedPlates = jest.fn()
      await wrapper.setData({ labwhereResponse: { success: true } })
      await wrapper.vm.findPlates({ success: true, barcodes })
      await flushPromises()
      expect(lighthouse.findPlatesFromBarcodes).toHaveBeenCalledWith({
        success: true,
        barcodes,
      })
      expect(wrapper.vm.sortedPlates).not.toHaveBeenCalled()
      expect(wrapper.vm.plates).toEqual([])
      expect(wrapper.text()).toContain('Lighthouse error')
    })
  })

  describe('#sortedPlates', () => {
    it('returns an empty list if no plates', () => {
      wrapper = mount(BoxBuster, { localVue })
      const plates = []
      expect(wrapper.vm.sortedPlates(plates)).toEqual([])
    })

    it('sorts by must_sequence, then preferentially_sequence, then number_of_positives', () => {
      wrapper = mount(BoxBuster, { localVue })
      const result = wrapper.vm.sortedPlates(examplePlates)
      expect(result[0].plate_barcode).toEqual('AP-rna-4-5-posi')
      expect(result[1].plate_barcode).toEqual('AP-rna-6-2-posi')
      expect(result[2].plate_barcode).toEqual('AP-rna-2-2-posi')
      expect(result[3].plate_barcode).toEqual('AP-rna-5-0-posi')
      expect(result[4].plate_barcode).toEqual('AP-rna-1-8-posi')
      expect(result[5].plate_barcode).toEqual('AP-rna-3-0-nmap')
    })
  })
})
