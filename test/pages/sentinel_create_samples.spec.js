import api from '@/modules/api'
import SentinelCreateSamples from '@/pages/sentinel_create_samples'
import { createLocalVue, mount } from '@vue/test-utils'
import { BootstrapVue } from 'bootstrap-vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('lighthouse sentinel cherrypick', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(SentinelCreateSamples, {
      localVue,
      data() {
        return {
          boxBarcode: 'lw-ogilvie-4',
          items: [],
        }
      },
    })
  })

  it('is a Vue instance', () => {
    expect(wrapper.findComponent(SentinelCreateSamples).exists()).toBeTruthy()
  })

  it('has a barcode', () => {
    expect(wrapper.vm.boxBarcode).toEqual('lw-ogilvie-4')
  })

  it('has items', () => {
    expect(wrapper.vm.items).toEqual([])
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
      expect(wrapper.vm.handleSentinelSampleCreation).toHaveBeenCalled()
    })
  })

  describe('cancel button', () => {
    let button

    it('has a cancel button', () => {
      button = wrapper.find('#cancelSearch')
      expect(button.text()).toEqual('Cancel')
    })

    it('on cancel button click it calls cancelSearch', () => {
      wrapper.vm.cancelSearch = jest.fn()
      button = wrapper.find('#cancelSearch')
      button.trigger('click')
      expect(wrapper.vm.cancelSearch).toHaveBeenCalled()
    })
  })

  describe('#cancelSearch', () => {
    it('clears boxBarcode', () => {
      wrapper.vm.cancelSearch()
      expect(wrapper.vm.boxBarcode).toEqual('')
    })
  })

  describe('#handleSentinelSampleCreation', () => {
    it('calls createSamples', async () => {
      api.createSamples = jest.fn()
      wrapper.vm.handleSentinelSampleCreationResponse = jest.fn()
      await wrapper.vm.handleSentinelSampleCreation()
      expect(api.createSamples).toHaveBeenCalled()
    })

    it('calls createSamples with mocked return', async () => {
      const expected = [{ it: 'worked' }]
      api.createSamples = jest.fn().mockReturnValue(expected)
      wrapper.vm.handleSentinelSampleCreationResponse = jest.fn()
      await wrapper.vm.handleSentinelSampleCreation()
      expect(wrapper.vm.handleSentinelSampleCreationResponse).toHaveBeenCalledWith(expected)
    })
  })

  describe('#handleSentinelSampleCreationResponse', () => {
    let response

    it('on success it populates the table', () => {
      response = [
        {
          data: {
            data: {
              plate_barcode: 'aBarcode1',
              centre: 'tst1',
              number_of_positives: 3,
            },
          },
        },
        {
          data: {
            data: {
              plate_barcode: 'aBarcode2',
              centre: 'tst1',
              number_of_positives: 1,
            },
          },
        },
      ]
      wrapper.vm.handleSentinelSampleCreationResponse(response)
      expect(wrapper.vm.items).toEqual(response.map((r) => r.data).map((r) => r.data))
    })

    it('on failure it shows an error message', () => {
      response = [
        {
          errors: ['an error 1'],
        },
        {
          errors: ['an error 2', 'an error 3'],
        },
      ]

      wrapper.vm.handleSentinelSampleCreationResponse(response)
      wrapper.vm.$nextTick(() => {
        expect(wrapper.findComponent({ ref: 'alert' }).text()).toMatch(
          /an error 1, an error 2, an error 3/
        )
      })
      expect(wrapper.vm.items).toEqual([])
    })

    it('on partial success/failure, last request successful', () => {
      response = [
        {
          errors: ['an error 1'],
        },
        {
          errors: ['an error 2'],
        },
        {
          data: {
            data: {
              plate_barcode: 'aBarcode1',
              centre: 'tst1',
              number_of_positives: 1,
            },
          },
        },
        {
          data: {
            data: {
              plate_barcode: 'aBarcode2',
              centre: 'tst1',
              number_of_positives: 1,
            },
          },
        },
      ]

      wrapper.vm.handleSentinelSampleCreationResponse(response)
      wrapper.vm.$nextTick(() => {
        expect(wrapper.findComponent({ ref: 'alert' }).text()).toMatch(/an error 1, an error 2/)
      })
      expect(wrapper.vm.items).toEqual(
        response
          .slice(2)
          .map((r) => r.data)
          .map((r) => r.data)
      )
    })

    it('on partial success/failure, last request failed', () => {
      response = [
        {
          errors: ['an error 2'],
        },
        {
          data: {
            data: {
              plate_barcode: 'aBarcode1',
              centre: 'tst1',
              number_of_positives: 1,
            },
          },
        },
        {
          data: {
            data: {
              plate_barcode: 'aBarcode2',
              centre: 'tst1',
              number_of_positives: 1,
            },
          },
        },
        {
          errors: ['an error 1'],
        },
      ]

      wrapper.vm.handleSentinelSampleCreationResponse(response)
      wrapper.vm.$nextTick(() => {
        expect(wrapper.findComponent({ ref: 'alert' }).text()).toMatch(/an error 2, an error 1/)
      })
      expect(wrapper.vm.items).toEqual(
        response
          .slice(1, 3)
          .map((r) => r.data)
          .map((r) => r.data)
      )
    })
  })
})
