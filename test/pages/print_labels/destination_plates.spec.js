import { BootstrapVue } from 'bootstrap-vue'
import { mount, createLocalVue } from '@vue/test-utils'
import PrintDestinationPlateLabels from '@/pages/print_labels/destination_plates'
import Sprint from '@/modules/sprint_general_labels'
import config from '@/nuxt.config'

jest.mock('@/modules/sprint_general_labels')

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('print destination plate labels', () => {
  let wrapper, vm, printers

  beforeEach(() => {
    printers = config.publicRuntimeConfig.printers.split(',')
    wrapper = mount(PrintDestinationPlateLabels, {
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
    expect(wrapper.findComponent(PrintDestinationPlateLabels).exists()).toBeTruthy()
  })

  it('should have some printers', () => {
    expect(vm.printers).toBeDefined()
    expect(vm.printers).toEqual(printers)
  })

  it('should be able to select a printer', () => {
    expect(wrapper.find('#selectPrinter').findAll('option')).toHaveLength(printers.length)
  })

  it('should be able to select a number of labels', () => {
    const input = wrapper.find('#numberOfBarcodes')
    input.setValue(10)
    expect(vm.numberOfBarcodes).toBe('10')
  })

  describe('printing labels', () => {
    beforeEach(() => {
      wrapper = mount(PrintDestinationPlateLabels, {
        localVue,
        data() {
          return {
            printer: 'heron-bc1',
            numberOfBarcodes: 10,
          }
        },
      })
      vm = wrapper.vm
    })

    it('successfully', async () => {
      Sprint.printDestinationPlateLabels.mockReturnValue({
        success: true,
        message: 'Labels successfully printed',
      })
      await vm.printLabels()
      expect(wrapper.find('.alert').text()).toMatch('Labels successfully printed')
    })

    it('unsuccessfully', async () => {
      Sprint.printDestinationPlateLabels.mockReturnValue({
        success: false,
        error: 'There was an error',
      })
      await vm.printLabels()
      expect(wrapper.find('.alert').text()).toMatch('There was an error')
    })
  })
})
