import BootstrapVue from 'bootstrap-vue'
import { mount, createLocalVue } from '@vue/test-utils'
import LighthouseSentinelBatch from '@/pages/lighthouse_sentinel_batch'
import * as apiModule from '@/modules/api'

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

  // TODO: Are these necessary. Would this be better done in an integration test.
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

    it('handleSentinelSampleCreation', async () => {
      apiModule.handleApiCall = jest.fn().mockReturnValue('mock response')
      const result = await wrapper.vm.handleSentinelSampleCreation()
      expect(apiModule.handleApiCall).toBeCalled()
      expect(result).toEqual('mock response')
    })
  })
})
