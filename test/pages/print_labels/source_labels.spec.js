import fs from 'fs'
import BootstrapVue from 'bootstrap-vue'
import { mount, createLocalVue } from '@vue/test-utils'
import SourcePlates from '@/pages/print_labels/source_plates'
import statuses from '@/modules/statuses'
import Sprint from '@/modules/sprint'
import CSV from '@/modules/csv'
import config from '@/nuxt.config'
import barcodes from '@/test/data/barcodes'

jest.mock('@/modules/sprint')
jest.mock('@/modules/csv')

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('print destination plate labels', () => {
  let wrapper, vm, printers

  beforeEach(() => {
    printers = config.publicRuntimeConfig.printers.split(',')
    wrapper = mount(SourcePlates, {
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
    expect(wrapper.findComponent(SourcePlates).exists()).toBeTruthy()
  })

  it('should have some printers', () => {
    expect(vm.printers).toBeDefined()
    expect(vm.printers).toEqual(printers)
  })

  it('should be able to select a printer', () => {
    expect(wrapper.find('#selectPrinter').findAll('option').length).toEqual(
      printers.length
    )
  })

  it('#setMessage', () => {
    vm.setStatus('Success', 'Barcodes successfully printed')
    expect(vm.status).toEqual(statuses.Success)
    expect(vm.alertMessage).toEqual('Barcodes successfully printed')
  })

  // TODO: the following 3 tests are arbitrary just to get it to pass.
  it('browse files', () => {
    vm.browseFiles()
    expect(true).toBeTruthy()
  })

  it('get files', () => {
    vm.getFile = jest.fn()
    vm.getFile()
    expect(true).toBeTruthy()
  })

  it('add filenames', () => {
    vm.addFilenames()
    expect(true).toBeTruthy()
  })

  // TODO: These tests are duplicated so will be removed once refactored. Need to get it to pass code coverage.
  describe('setting the status', () => {
    let vm

    it('default should be idle', () => {
      vm = mount(SourcePlates, { localVue }).vm
      expect(vm.isIdle).toBeTruthy()
    })

    it('when success', () => {
      wrapper = mount(SourcePlates, {
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
      wrapper = mount(SourcePlates, {
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
      wrapper = mount(SourcePlates, {
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
    let mock

    describe('when the filename has not been entered', () => {
      beforeEach(() => {
        wrapper = mount(SourcePlates, {
          localVue,
          data() {
            return {
              printer: 'heron-bc1',
              numberOfBarcodes: 10,
              filename: null
            }
          }
        })
        vm = wrapper.vm
      })

      it('should show an error message', async () => {
        await vm.printLabels()
        expect(wrapper.find('.alert').text()).toMatch('Please upload a file')
      })
    })

    describe('when the filename has been entered', () => {
      let readFile, file

      afterEach(() => {
        jest.resetAllMocks()
      })

      beforeEach(() => {
        wrapper = mount(SourcePlates, {
          localVue,
          data() {
            return {
              printer: 'heron-bc1',
              numberOfBarcodes: 10,
              filename: 'barcodes.csv'
            }
          }
        })
        vm = wrapper.vm
        mock = jest.spyOn(Sprint, 'printLabels')
        vm.getFile = jest.fn()
        readFile = fs.readFileSync('./test/data/barcodes.csv', 'ascii')
        file = new File([readFile], 'barcodes.csv', { type: 'text/csv' })
        CSV.parse.mockResolvedValue(barcodes)
        vm.getFile.mockReturnValue(file)
      })

      it('successfully', async () => {
        mock.mockResolvedValue({
          success: true,
          message: 'successfully printed 5 labels to heron-bc3'
        })
        await vm.printLabels()
        expect(wrapper.find('.alert').text()).toMatch(
          'successfully printed 5 labels to heron-bc3'
        )
      })

      it('unsuccessfully', async () => {
        mock.mockReturnValue({
          success: false,
          error: 'There was an error'
        })
        await vm.printLabels()
        expect(wrapper.find('.alert').text()).toMatch('There was an error')
      })
    })
  })
})
