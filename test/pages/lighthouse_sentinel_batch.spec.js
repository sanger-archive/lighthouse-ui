import BootstrapVue from 'bootstrap-vue'
import { mount, createLocalVue } from '@vue/test-utils'
import LighthouseSentinelBatch from '@/pages/lighthouse_sentinel_batch'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('lighthouse sentinel batch', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(LighthouseSentinelBatch, {
      localVue,
      data() {
        return {
          boxBarcode: 'lw-ogilvie-4',
          checkBox: ['positive']
        }
      }
    })
  })

  it('is a Vue instance', () => {
    expect(wrapper.findComponent(LighthouseSentinelBatch).exists()).toBeTruthy()
  })

  it('has a barcode', () => {
    expect(wrapper.vm.boxBarcode).toEqual('lw-ogilvie-4')
  })

  describe('checkbox', () => {
    it('is defined', () => {
      expect(wrapper.find('#box-check').exists()).toBeTruthy()
    })

    it('has a default value of positive', () => {
      expect(wrapper.vm.checkBox).toEqual(['positive'])
    })
  })

  describe('submission', () => {
    let button

    it('has a submit button', () => {
      button = wrapper.find('#handleSentinelSampleCreation')
      expect(button.text()).toEqual('Submit')
    })

    it('on submit button click it calls handleSentinelSampleCreation', () => {
      wrapper.vm.handleSentinelSampleCreation = jest.fn()
      button = wrapper.find('#handleSentinelSampleCreation')
      button.trigger('click')
      expect(wrapper.vm.handleSentinelSampleCreation).toBeCalled()
    })

    it('has a cancel button', () => {
      button = wrapper.find('#cancelSearch')
      expect(button.text()).toEqual('Cancel')
    })

    it('on cancel button click it calls cancelSearch', () => {
      wrapper.vm.cancelSearch = jest.fn()
      button = wrapper.find('#cancelSearch')
      button.trigger('click')
      expect(wrapper.vm.cancelSearch).toBeCalled()
    })
  })

  describe('methods', () => {
    it('cancelSearch resets the box barcode and checkbox', () => {
      wrapper.vm.checkBox = ['positivesAndNegatives']

      wrapper.vm.cancelSearch()
      expect(wrapper.vm.checkBox).toEqual(['positive'])
      expect(wrapper.vm.boxBarcode).toEqual('')
    })

    it('checkCheckBox only allows one checkbox to be ticked', () => {
      wrapper.vm.checkBox = ['positivesAndNegatives', 'positive']

      wrapper.vm.checkCheckBox()
      expect(wrapper.vm.checkBox).toEqual(['positive'])
    })
  })
})
