import { BootstrapVue } from 'bootstrap-vue'
import { mount, createLocalVue } from '@vue/test-utils'
import PrintDestinationPlateLabels from '@/pages/print_labels/destination_plates'
import statuses from '@/modules/statuses'
import Sprint from '@/modules/sprint'
import config from '@/nuxt.config'

jest.mock('@/modules/sprint')

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
    expect(vm.numberOfBarcodes).toEqual('10')
  })

  it('#setMessage', () => {
    vm.setStatus('Success', 'Barcodes successfully printed')
    expect(vm.status).toEqual(statuses.Success)
    expect(vm.alertMessage).toEqual('Barcodes successfully printed')
  })

  // TODO: These tests are duplicated so will be removed once refactored. Need to get it to pass code coverage.
  describe('setting the status', () => {
    let vm

    it('default should be idle', () => {
      vm = mount(PrintDestinationPlateLabels, { localVue }).vm
      expect(vm.isIdle).toBeTruthy()
    })

    it('when success', () => {
      wrapper = mount(PrintDestinationPlateLabels, {
        localVue,
        data() {
          return {
            status: statuses.Success,
            alertMessage: 'I am a success',
          }
        },
      })
      vm = wrapper.vm
      expect(vm.isSuccess).toBeTruthy()
      expect(wrapper.find('.alert').text()).toMatch('I am a success')
    })

    it('when error', () => {
      wrapper = mount(PrintDestinationPlateLabels, {
        localVue,
        data() {
          return {
            status: statuses.Error,
            alertMessage: 'I am a failure',
          }
        },
      })
      vm = wrapper.vm
      expect(vm.isError).toBeTruthy()
      expect(wrapper.find('.alert').text()).toMatch('I am a failure')
    })

    it('when busy', () => {
      wrapper = mount(PrintDestinationPlateLabels, {
        localVue,
        data() {
          return {
            status: statuses.Busy,
            alertMessage: 'I am busy',
          }
        },
      })
      vm = wrapper.vm
      expect(vm.isBusy).toBeTruthy()
      expect(wrapper.find('.alert').text()).toMatch('I am busy')
    })
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
