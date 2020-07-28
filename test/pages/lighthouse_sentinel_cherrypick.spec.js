import BootstrapVue from 'bootstrap-vue'
import { mount, createLocalVue } from '@vue/test-utils'
import LighthouseSentinelCherrypick from '@/pages/lighthouse_sentinel_cherrypick'
import * as labwhereModule from '@/modules/labwhere'
import * as sequencescapeModule from '@/modules/sequencescape'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('lighthouse sentinel cherrypick', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(LighthouseSentinelCherrypick, {
      localVue,
      data() {
        return {
          boxBarcodes: 'lw-ogilvie-4\nlw-ogilvie-5\nlw-ogilvie-6',
          items: []
        }
      }
    })
  })

  it('is a Vue instance', () => {
    expect(
      wrapper.findComponent(LighthouseSentinelCherrypick).exists()
    ).toBeTruthy()
  })

  it('has barcodes', () => {
    expect(wrapper.vm.boxBarcodes).toEqual(
      'lw-ogilvie-4\nlw-ogilvie-5\nlw-ogilvie-6'
    )
  })

  it('has items', () => {
    expect(wrapper.vm.items).toEqual([])
  })

  describe('getting plates', () => {
    let button

    it('has a get plates button', () => {
      button = wrapper.find('#handlePlatesRetrieval')
      expect(button.text()).toEqual('Get plates')
    })

    it('on get plates button click it calls getPlates', () => {
      wrapper.vm.getPlates = jest.fn()
      button = wrapper.find('#handlePlatesRetrieval')
      button.trigger('click')
      expect(wrapper.vm.getPlates).toBeCalled()
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
      expect(wrapper.vm.cancelSearch).toBeCalled()
    })
  })

  describe('#cancelSearch', () => {
    it('it clears boxBarcode', () => {
      wrapper.vm.cancelSearch()
      expect(wrapper.vm.boxBarcodes).toEqual('')
    })
  })

  describe('#getPlates', () => {
    it('calls getPlatesFromBoxBarcodes', async () => {
      labwhereModule.getPlatesFromBoxBarcodes = jest.fn()
      wrapper.vm.handleGetPlatesResponse = jest.fn()
      await wrapper.vm.getPlates()
      expect(labwhereModule.getPlatesFromBoxBarcodes).toBeCalled()
    })
  })

  describe('#handleGetPlatesResponse', () => {
    let response

    it('on success it populates the table', () => {
      response = ['aBarcode1','aBarcode2']
      wrapper.vm.handleGetPlatesResponse(response)

      let expected = [
        {
          "plate_barcode": response[0],
          "selected": true
        },
        {
          "plate_barcode": response[1],
          "selected": true
        }
      ]

      expect(wrapper.vm.items).toEqual(expected)
    })

    it('on failure it shows an error message', () => {
      response = []

      wrapper.vm.handleGetPlatesResponse(response)
      wrapper.vm.$nextTick(() => {
        expect(wrapper.findComponent({ ref: 'alert' }).text()).toMatch(
          /Could not retrieve plates from LabWhere/
        )
      })
      expect(wrapper.vm.items).toEqual([])
    })
  })
})
