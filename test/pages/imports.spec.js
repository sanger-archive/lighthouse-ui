import BootstrapVue from 'bootstrap-vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Imports from '@/pages/imports'
import * as lighthouseServiceModule from '@/modules/lighthouse_service'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('Imports', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Imports, {
      localVue,
      data() {
        return {
          items: []
        }
      }
    })
    wrapper.vm.provider = jest.fn()
  })

  it('is a Vue instance', () => {
    expect(wrapper.findComponent(Imports).exists()).toBeTruthy()
  })

  describe('#getItemsProvider', () => {
    it('calls the correct functions', async () => {
      const items = [{ test: 1 }]
      const expectedResponse = { success: true, data: { _items: items } }

      lighthouseServiceModule.getImports = jest.fn()
      wrapper.vm.handleItemsResponse = jest.fn()

      lighthouseServiceModule.getImports.mockReturnValue(expectedResponse)

      await wrapper.vm.getItemsProvider()

      expect(lighthouseServiceModule.getImports).toBeCalled()
      expect(wrapper.vm.handleItemsResponse).toBeCalledWith(expectedResponse)
    })
  })

  describe('#handleItemsResponse', () => {
    let response, errorMsg

    it('handles success', () => {
      const items = [{ test: 1 }]
      response = { success: true, data: { _items: items } }

      const resp = wrapper.vm.handleItemsResponse(response)
      expect(resp).toEqual(items)
    })

    it('handles failure', () => {
      errorMsg = 'an error message'
      response = { success: false, error: errorMsg }
      const resp = wrapper.vm.handleItemsResponse(response)

      expect(wrapper.vm.alertData).toEqual({
        variant: 'danger',
        message: errorMsg
      })
      expect(wrapper.vm.showDismissibleAlert).toEqual(true)
      expect(resp).toEqual([])
    })

    it('on failure it shows an error message', () => {
      response = { success: false, error: 'an error message' }
      wrapper.vm.handleItemsResponse(response)

      wrapper.vm.$nextTick(() => {
        expect(wrapper.findComponent({ ref: 'alert' }).text()).toMatch(
          /an error message/
        )
      })
    })
  })

  describe('table filtering', () => {
    beforeEach(() => {
      wrapper = mount(Imports, {
        localVue,
        data() {
          return {
            items: [
              { centre_name: 'I should be hidden' },
              { centre_name: 'pick me!' }
            ]
          }
        }
      })
      wrapper.vm.provider = jest.fn()
    })

    it('filters based on entered search term', () => {
      wrapper.vm.filter = 'me'

      wrapper.vm.$nextTick(() => {
        expect(wrapper.find('#imports-table').html()).toMatch(/pick me!/)
        expect(wrapper.find('#imports-table').html()).not.toMatch(/I should be hidden/)
      })
    })
  })
})
