import { BootstrapVue } from 'bootstrap-vue'
import { mount, createLocalVue } from '@vue/test-utils'
import PrintReagentAliquotsLabels from '@/pages/print_labels/reagent_aliquots'
import PrintLabels from '@/modules/sprint_reagent_aliquot_labels'
import config from '@/nuxt.config'

jest.mock('@/modules/sprint_reagent_aliquot_labels')

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('print destination plate labels', () => {
  let wrapper, vm, printers

  beforeEach(() => {
    printers = config.publicRuntimeConfig.printers.split(',')
    wrapper = mount(PrintReagentAliquotsLabels, {
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
    expect(wrapper.findComponent(PrintReagentAliquotsLabels).exists()).toBeTruthy()
  })

  it('should have some printers', () => {
    expect(vm.printers).toBeDefined()
    expect(vm.printers).toEqual(printers)
  })

  it('should be able to select a printer', () => {
    expect(wrapper.find('#selectPrinter').findAll('option')).toHaveLength(printers.length)
  })

  it('should be able to specify a first line of text', () => {
    const input = wrapper.find('#firstLineText')
    input.setValue('A nice line of text')
    expect(vm.firstLineText).toBe('A nice line of text')
  })

  it('should be able to specify a second line of text', () => {
    const input = wrapper.find('#secondLineText')
    input.setValue('Another nice line of text')
    expect(vm.secondLineText).toBe('Another nice line of text')
  })

  it('should be able to specify a barcode', () => {
    const input = wrapper.find('#barcode')
    input.setValue('BARCODE-123456')
    expect(vm.barcode).toBe('BARCODE-123456')
  })


  it('should be able to select a number of labels', () => {
    const input = wrapper.find('#numberOfLabels')
    input.setValue(10)
    expect(vm.numberOfLabelsString).toBe('10')
    expect(vm.numberOfLabels).toBe(10)
  })

  describe('with initial data', () => {
    beforeEach(() => {
      wrapper = mount(PrintReagentAliquotsLabels, {
        localVue,
        data() {
          return {
            printer: 'heron-bc1',
            firstLineText: 'First line',
            secondLineText: 'Second line',
            barcode: 'BARCODE',
            numberOfLabelsString: '10',
          }
        },
      })
      vm = wrapper.vm
    })

    it('is valid', () => {
      expect(vm.isValid).toBeTruthy()
    })

    it('stays valid when quantity is changed to 1', () => {
      vm.numberOfLabelsString = '1'
      expect(vm.isValid).toBeTruthy()
    })

    it('stays valid when quantity is changed to 100', () => {
      vm.numberOfLabelsString = '100'
      expect(vm.isValid).toBeTruthy()
    })

    it('stays valid when second line of text is left blank', () => {
      vm.secondLineText = ''
      expect(vm.isValid).toBeTruthy()
    })

    it('becomes invalid when quantity is changed below 1', () => {
      vm.numberOfLabelsString = '0'
      expect(vm.isValid).toBeFalsy()
    })

    it('becomes invalid when quantity is changed above 100', () => {
      vm.numberOfLabelsString = '101'
      expect(vm.isValid).toBeFalsy()
    })

    it('becomes invalid when quantity is not a number', () => {
      vm.numberOfLabelsString = 'banana'
      expect(vm.isValid).toBeFalsy()
    })

    it('becomes invalid when barcode is left blank', () => {
      vm.barcode = ''
      expect(vm.isValid).toBeFalsy()
    })

    it('becomes invalid when first line of text is left blank', () => {
      vm.firstLineText = ''
      expect(vm.isValid).toBeFalsy()
    })
  })

  describe('printing labels', () => {
    beforeEach(() => {
      wrapper = mount(PrintReagentAliquotsLabels, {
        localVue,
        data() {
          return {
            printer: 'heron-bc1',
            firstLineText: 'First line',
            secondLineText: 'Second line',
            barcode: 'BARCODE',
            numberOfLabelsString: '10',
          }
        },
      })
      vm = wrapper.vm
    })

    it('passes the correct arguments to PrintLabel', async () => {
      PrintLabels.mockReturnValue({
        success: true,
        message: 'Labels successfully printed',
      })
      await vm.printLabels()
      expect(PrintLabels).toHaveBeenCalledWith({
        barcode: 'BARCODE',
        firstText: 'First line',
        secondText: 'Second line',
        printer: 'heron-bc1',
        quantity: 10,
      })
    })

    it('successfully', async () => {
      PrintLabels.mockReturnValue({
        success: true,
        message: 'Labels successfully printed',
      })
      await vm.printLabels()
      expect(wrapper.find('.alert').text()).toMatch('Labels successfully printed')
    })

    it('unsuccessfully', async () => {
      PrintLabels.mockReturnValue({
        success: false,
        error: 'There was an error',
      })
      await vm.printLabels()
      expect(wrapper.find('.alert').text()).toMatch('There was an error')
    })
  })
})
