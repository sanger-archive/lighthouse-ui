import BootstrapVue from 'bootstrap-vue'
import { mount, createLocalVue } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import BoxBuster from '@/pages/box_buster.vue'
import { getPlatesFromBoxBarcodes } from '@/modules/labwhere'
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
  number_of_positives: 8
}
const plateB = {
  plate_barcode: 'AP-rna-2-2-posi',
  plate_map: true,
  number_of_positives: 2
}
const plateC = {
  plate_barcode: 'AP-rna-3-0-nmap',
  plate_map: false,
  number_of_positives: null
}
const plateD = {
  plate_barcode: 'AP-rna-4-5-posi',
  plate_map: true,
  number_of_positives: 5
}
const plateE = {
  plate_barcode: 'AP-rna-5-0-posi',
  plate_map: true,
  number_of_positives: 0
}
const examplePlates = [plateA, plateB, plateC, plateD, plateE]
const expectedPlateTotal = 5
const expectedMapTotal = 4
const expectedMaplessTotal = 1
const expectedPositiveTotal = 15

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
  })

  it('shows a table with the expected headers', async () => {
    const wrapper = mount(BoxBuster, { localVue })
    await wrapper.setData({ labwhereResponse: { success: true } })
    const header = wrapper.find('table').findAll('th')
    expect(header.at(0).text()).toContain('Barcode')
    expect(header.at(1).text()).toContain('Plate Map')
    expect(header.at(2).text()).toContain('Number Of Positives')
  })

  it("only shows the table once we've scanned the Box", async () => {
    const wrapper = mount(BoxBuster, { localVue })
    await wrapper.setData({ labwhereResponse: { success: null } })
    expect(wrapper.find('table').exists()).toBe(false)
  })

  it('sorts list of plates by plateMap and positive count', async () => {
    const data = { plates: examplePlates }
    wrapper = mount(BoxBuster, { localVue })
    await wrapper.setData(data)
    const rows = wrapper.find('table').findAll('tr')
    expect(rows.at(1).text()).toContain('AP-rna-1-8-posi')
    expect(rows.at(2).text()).toContain('AP-rna-4-5-posi')
    expect(rows.at(3).text()).toContain('AP-rna-2-2-posi')
    expect(rows.at(4).text()).toContain('AP-rna-5-0-posi')
    expect(rows.at(5).text()).toContain('AP-rna-3-0-nmap')
  })

  it('renders a summary of plates', async () => {
    const data = { plates: examplePlates }
    const expected = squish(`Box Summary: Total of ${expectedPlateTotal} plates in box;
    ${expectedMapTotal} plates with plates maps,
    ${expectedMaplessTotal} without.
    Total ${expectedPositiveTotal} positives.
    Box barcodes scanned:`)
    wrapper = mount(BoxBuster, { localVue })
    await wrapper.setData(data)
    const summary = squish(wrapper.find('caption').text())
    expect(summary).toBe(expected)
  })

  it('makes it easy to see when plates have a plate map', async () => {
    const data = { plates: [plateA] }
    wrapper = mount(BoxBuster, { localVue })
    await wrapper.setData(data)
    const row = wrapper
      .find('table')
      .findAll('tr')
      .at(1)
    expect(row.text()).toBe('AP-rna-1-8-posiYes8')
    expect(row.classes()).toContain('table-success')
  })

  it('makes it easy to see when plates do not have a plate map', async () => {
    const data = { plates: [plateC] }
    wrapper = mount(BoxBuster, { localVue })
    await wrapper.setData(data)
    const row = wrapper
      .find('table')
      .findAll('tr')
      .at(1)
    expect(row.text()).toBe('AP-rna-3-0-nmapNoN/A')
    expect(row.classes()).toContain('table-danger')
  })

  it('lets the user know if the box is empty', async () => {
    getPlatesFromBoxBarcodes.mockResolvedValue({
      success: false,
      error: 'The box has no plates'
    })
    lighthouse.findPlatesFromBarcodes.mockResolvedValue({
      success: true,
      plates: []
    })
    wrapper = mount(BoxBuster, { localVue })
    const barcodeField = wrapper.find('#box-barcode-field')
    barcodeField.setValue('12345')
    await barcodeField.trigger('change')
    await flushPromises()
    expect(wrapper.text()).toContain('The box has no plates')
  })

  it('lets the user know if labwhere errors', async () => {
    getPlatesFromBoxBarcodes.mockResolvedValue({
      success: false,
      error: new Error('Server Error')
    })
    lighthouse.findPlatesFromBarcodes.mockResolvedValue({
      success: true,
      plates: []
    })
    wrapper = mount(BoxBuster, { localVue })
    const barcodeField = wrapper.find('#box-barcode-field')
    barcodeField.setValue('12345')
    await barcodeField.trigger('change')
    await flushPromises()
    expect(wrapper.text()).toContain('Server Error')
  })

  it('falls back to a plate lookup if there appears to be no box', async () => {
    getPlatesFromBoxBarcodes.mockResolvedValue({
      success: false,
      error: new Error('Server Error')
    })
    lighthouse.findPlatesFromBarcodes.mockResolvedValue({
      success: true,
      plates: []
    })
    wrapper = mount(BoxBuster, { localVue })
    const barcodeField = wrapper.find('#box-barcode-field')
    barcodeField.setValue('12345')
    await barcodeField.trigger('change')
    await flushPromises()
    expect(lighthouse.findPlatesFromBarcodes).toHaveBeenCalledWith({
      barcodes: ['12345']
    })
  })

  it('looks up barcodes in labwhere', async () => {
    const barcodes = [
      'AP-rna-1-8-posi',
      'AP-rna-2-2-posi',
      'AP-rna-3-0-nmap',
      'AP-rna-4-5-posi',
      'AP-rna-5-0-posi'
    ]
    getPlatesFromBoxBarcodes.mockResolvedValue({ success: true, barcodes })
    lighthouse.findPlatesFromBarcodes.mockResolvedValue({
      success: true,
      plates: []
    })
    wrapper = mount(BoxBuster, { localVue })
    const barcodeField = wrapper.find('#box-barcode-field')
    barcodeField.setValue('12345')
    await barcodeField.trigger('change')
    await flushPromises()
    expect(wrapper.text()).toContain('Box found')
    expect(getPlatesFromBoxBarcodes).toHaveBeenCalledWith('12345')
  })

  it('looks up plates in lighthouse', async () => {
    const barcodes = [
      'AP-rna-1-8-posi',
      'AP-rna-2-2-posi',
      'AP-rna-3-0-nmap',
      'AP-rna-4-5-posi',
      'AP-rna-5-0-posi'
    ]
    getPlatesFromBoxBarcodes.mockResolvedValue({ success: true, barcodes })
    lighthouse.findPlatesFromBarcodes.mockResolvedValue({
      success: true,
      plates: []
    })
    wrapper = mount(BoxBuster, { localVue })
    const barcodeField = wrapper.find('#box-barcode-field')
    barcodeField.setValue('12345')
    await barcodeField.trigger('change')
    await flushPromises()
    expect(lighthouse.findPlatesFromBarcodes).toHaveBeenCalledWith({
      success: true,
      barcodes
    })
  })

  it('populates plates from lighthouse', async () => {
    const barcodes = [
      'AP-rna-1-8-posi',
      'AP-rna-2-2-posi',
      'AP-rna-3-0-nmap',
      'AP-rna-4-5-posi',
      'AP-rna-5-0-posi'
    ]
    lighthouse.findPlatesFromBarcodes.mockResolvedValue({
      success: true,
      plates: examplePlates
    })
    wrapper = mount(BoxBuster, { localVue })
    wrapper.vm.findPlates({ success: true, barcodes })
    await flushPromises()
    expect(lighthouse.findPlatesFromBarcodes).toHaveBeenCalledWith({
      success: true,
      barcodes
    })
    expect(wrapper.vm.plates).toEqual(examplePlates)
  })

  it('displays lighthouse errors', async () => {
    const barcodes = [
      'AP-rna-1-8-posi',
      'AP-rna-2-2-posi',
      'AP-rna-3-0-nmap',
      'AP-rna-4-5-posi',
      'AP-rna-5-0-posi'
    ]
    lighthouse.findPlatesFromBarcodes.mockResolvedValue({
      success: false,
      error: new Error('Lighthouse error')
    })
    wrapper = mount(BoxBuster, { localVue })
    await wrapper.setData({ labwhereResponse: { success: true } })
    await wrapper.vm.findPlates({ success: true, barcodes })
    await flushPromises()
    expect(wrapper.vm.plates).toEqual([])
    expect(wrapper.text()).toContain('Lighthouse error')
  })

  it('will not look up empty barcodes', async () => {
    wrapper = mount(BoxBuster, { localVue })
    const barcodeField = wrapper.find('#box-barcode-field')
    barcodeField.setValue('')
    await barcodeField.trigger('change')
    await flushPromises()
    expect(getPlatesFromBoxBarcodes).not.toHaveBeenCalled()
  })
})
