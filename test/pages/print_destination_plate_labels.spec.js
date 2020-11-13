import BootstrapVue from 'bootstrap-vue'
import { mount, createLocalVue } from '@vue/test-utils'
import PrintDestinationPlateLabels from '@/pages/print_destination_plate_labels'
import statuses from '@/modules/statuses'
// import sprint from '@/modules/sprint'

jest.mock('@/modules/sprint')

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('print destination plate labels', () => {
  let wrapper, vm

  beforeEach(() => {
    wrapper = mount(PrintDestinationPlateLabels, {
      localVue,
      data() {
        return {}
      }
    })
    vm = wrapper.vm
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('is a Vue instance', () => {
    expect(
      wrapper.findComponent(PrintDestinationPlateLabels).exists()
    ).toBeTruthy()
  })

  it('should have some printers', () => {
    expect(vm.printers).toBeDefined()
    expect(vm.printers.length).toEqual(3)
  })

  it('should be able to select a printer', () => {
    expect(wrapper.find('#selectPrinter').findAll('option').length).toEqual(3)
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
            alertMessage: 'I am a success'
          }
        }
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
            alertMessage: 'I am a failure'
          }
        }
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
            alertMessage: 'I am busy'
          }
        }
      })
      vm = wrapper.vm
      expect(vm.isBusy).toBeTruthy()
      expect(wrapper.find('.alert').text()).toMatch('I am busy')
    })
  })

  describe('printing labels', () => {
    it('successfully', () => {})

    it('unsuccessfully', () => {})
  })
})
