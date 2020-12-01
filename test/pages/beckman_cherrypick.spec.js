import { createLocalVue, shallowMount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import BeckmanCherrypick from '@/pages/beckman_cherrypick.vue'
import BeckmanCherrypickForm from '@/components/BeckmanCherrypickForm'
import lighthouse from '@/modules/lighthouse_service'

jest.mock('@/modules/lighthouse_service')

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('Beckman Cherrypick', () => {
  let wrapper, page

  beforeEach(() => {
    lighthouse.getRobots.mockReturnValue({
      success: true,
      robots: [
        {'name': 'robot 1', 'serial_number': 'B00000001'},
        {'name': 'robot 2', 'serial_number': 'B00000002'}
      ]
    })

    lighthouse.getFailureTypes.mockReturnValue({
      success: true,
      failure_types: [
        {'type': 'Type 1', 'description': 'Description of error 1'},
        {'type': 'Type 2', 'description': 'Description of error 2'}
      ]
    })

    wrapper = shallowMount(BeckmanCherrypick, {
      localVue,
    })
    page = wrapper.vm
  })

  it('is a Vue instance', () => {
    expect(wrapper.findComponent(BeckmanCherrypick).exists()).toBeTruthy()
  })

  describe('mounted', () => {
    it('calls lighthouse initialiser methods', () => {
      expect(lighthouse.getRobots).toHaveBeenCalled()
      expect(lighthouse.getFailureTypes).toHaveBeenCalled()
    })
  })

  describe('#getRobots', () => {
    it('on success it sets the robots data', () => {
      page.getRobots()
      expect(page.robots.length).toEqual(2)
    })

    // TODO handler error
    it('on failure it does something', () => {
      lighthouse.getRobots.mockReturnValue({
        success: false,
        errors: ["An unexpected error occurred fetching Beckman robot information"]
      })

      wrapper = shallowMount(BeckmanCherrypick, {
        localVue,
      })
      expect(wrapper.vm.robots.length).toEqual(0)
    })
  })

  describe('#getFailureTypes', () => {
    it('sets the failure types data', () => {
      page.getFailureTypes()
      expect(page.failureTypes.length).toEqual(2)
    })

    // TODO handler error
    it('on failure it does something', () => {
      lighthouse.getFailureTypes.mockReturnValue({
        success: false,
        errors: ["No information exists for any Beckman failure types"]
      })

      wrapper = shallowMount(BeckmanCherrypick, {
        localVue,
      })
      expect(wrapper.vm.failureTypes.length).toEqual(0)
    })
  })
})
