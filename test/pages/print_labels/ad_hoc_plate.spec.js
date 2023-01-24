import { BootstrapVue } from 'bootstrap-vue'
import { mount, createLocalVue } from '@vue/test-utils'
import AdHocPlate from '@/pages/print_labels/ad_hoc_plate'
import Sprint from '@/modules/sprint_general_labels'
import config from '@/nuxt.config'

jest.mock('@/modules/sprint_general_labels')

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('print control plate labels', () => {
  let wrapper, vm, printers

  beforeEach(() => {
    printers = config.publicRuntimeConfig.printers.split(',')
    wrapper = mount(AdHocPlate, {
      localVue,
      data() {
        return {}
      },
    })
    vm = wrapper.vm
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('is a Vue instance', () => {
    expect(wrapper.findComponent(AdHocPlate).exists()).toBeTruthy()
  })

  it('should have some printers', () => {
    expect(vm.printers).toBeDefined()
    expect(vm.printers).toEqual(printers)
  })

  it('should be able to select a printer', () => {
    expect(wrapper.find('#selectPrinter').findAll('option')).toHaveLength(printers.length)
  })

  it('should be able to add a barcode', () => {
    const input = wrapper.find('#barcode')
    input.setValue('DN111111')
    expect(vm.barcode).toBe('DN111111')
  })

  it('should be able to add some text', () => {
    const input = wrapper.find('#text')
    input.setValue('some text')
    expect(vm.text).toBe('some text')
  })

  describe('printing labels', () => {
    afterEach(() => {
      jest.resetAllMocks()
    })

    beforeEach(() => {
      wrapper = mount(AdHocPlate, {
        localVue,
        data() {
          return {
            printer: 'heron-bc1',
            barcode: 'DN111111',
            text: 'some text',
          }
        },
      })
      vm = wrapper.vm
    })

    it('successfully', async () => {
      Sprint.printLabels.mockReturnValue({
        success: true,
        message: 'Labels successfully printed',
      })
      await vm.printLabels()
      expect(Sprint.printLabels).toHaveBeenCalled()
      expect(wrapper.find('.alert').text()).toMatch('Labels successfully printed')
    })

    it('unsuccessfully', async () => {
      Sprint.printLabels.mockReturnValue({
        success: false,
        error: 'There was an error',
      })
      await vm.printLabels()
      expect(wrapper.find('.alert').text()).toMatch('There was an error')
    })
  })
})
