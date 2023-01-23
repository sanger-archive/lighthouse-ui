import fs from 'fs'
import { BootstrapVue } from 'bootstrap-vue'
import { mount, createLocalVue } from '@vue/test-utils'
import SourcePlates from '@/pages/print_labels/source_plates'
import Sprint from '@/modules/sprint_general_labels'
import CSV from '@/modules/csv'
import config from '@/nuxt.config'
import barcodes from '@/test/data/barcodes'

jest.mock('@/modules/sprint_general_labels')
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
      },
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
    expect(wrapper.find('#selectPrinter').findAll('option')).toHaveLength(printers.length)
  })

  // Note: Not worthwhile testing the file picking actions since they
  // trigger browser operations outside our control.

  describe('printing labels', () => {
    let mock

    describe('when the filename has not been entered', () => {
      beforeEach(() => {
        wrapper = mount(SourcePlates, {
          localVue,
          data() {
            return {
              printer: 'heron-bc1',
              filename: null,
            }
          },
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
              filename: 'barcodes.csv',
            }
          },
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
          message: 'successfully printed 5 labels to heron-bc3',
        })
        await vm.printLabels()
        expect(wrapper.find('.alert').text()).toMatch('successfully printed 5 labels to heron-bc3')
      })

      it('unsuccessfully', async () => {
        mock.mockReturnValue({
          success: false,
          error: 'There was an error',
        })
        await vm.printLabels()
        expect(wrapper.find('.alert').text()).toMatch('There was an error')
      })
    })
  })
})
