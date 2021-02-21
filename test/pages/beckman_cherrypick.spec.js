import { createLocalVue, shallowMount } from '@vue/test-utils'
import { BootstrapVue } from 'bootstrap-vue'
import BeckmanCherrypick from '@/pages/beckman_cherrypick.vue'
import lighthouse from '@/modules/lighthouse_service'
import Alert from '@/components/Alert'
jest.mock('@/modules/lighthouse_service')

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('Beckman Cherrypick', () => {
  let wrapper, page, robots, failureTypes

  beforeEach(() => {
    robots = [
      { name: 'robot 1', serial_number: 'B00000001' },
      { name: 'robot 2', serial_number: 'B00000002' },
    ]

    failureTypes = [
      { type: 'Type 1', description: 'Description of error 1' },
      { type: 'Type 2', description: 'Description of error 2' },
    ]

    lighthouse.getRobots.mockReturnValue({
      success: true,
      robots,
    })

    lighthouse.getFailureTypes.mockReturnValue({
      success: true,
      failureTypes,
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

  describe('data', () => {
    it('has robots data', () => {
      expect(page.robots).toEqual(robots)
    })

    it('has failure types data', () => {
      expect(page.failureTypes).toEqual(failureTypes)
    })
  })

  describe('#getRobots', () => {
    it('on success it sets the robots data', async () => {
      await page.getRobots()
      expect(page.robots).toHaveLength(2)
    })

    it('on failure calls showAlert', async () => {
      page.showAlert = jest.fn()
      lighthouse.getRobots.mockReturnValue({
        errors: ['No information exists for any Beckman robots'],
        robots: [],
      })

      await page.getRobots()
      expect(page.robots).toHaveLength(0)
      expect(page.showAlert).toHaveBeenCalledWith(
        'No information exists for any Beckman robots',
        'danger'
      )
    })
  })

  describe('#getFailureTypes', () => {
    it('sets the failure types data', async () => {
      await page.getFailureTypes()
      expect(page.failureTypes).toHaveLength(2)
    })

    it('on failure calls showAlert', async () => {
      page.showAlert = jest.fn()
      lighthouse.getFailureTypes.mockReturnValue({
        errors: ['No information exists for any Beckman failure types'],
        failureTypes: [],
      })

      await page.getFailureTypes()
      expect(page.failureTypes).toHaveLength(0)
      expect(page.showAlert).toHaveBeenCalledWith(
        'No information exists for any Beckman failure types',
        'danger'
      )
    })
  })

  describe('#create', () => {
    let form

    beforeEach(() => {
      form = {
        username: 'username',
        barcode: 'barcode',
        robotSerialNumber: 'robotSerialNumber',
      }
    })

    it('on success it shows an alert', async () => {
      page.showAlert = jest.fn()
      lighthouse.createDestinationPlate.mockReturnValue({
        success: true,
        response: 'A successful response message',
      })

      await page.create(form)
      expect(page.showAlert).toHaveBeenCalledWith('A successful response message', 'success')
    })

    it('on failure calls showAlert', async () => {
      page.showAlert = jest.fn()
      lighthouse.createDestinationPlate.mockReturnValue({
        success: false,
        errors: ['an error'],
      })

      await page.create(form)
      expect(page.showAlert).toHaveBeenCalledWith('an error', 'danger')
    })
  })

  describe('#fail', () => {
    let form

    beforeEach(() => {
      form = {
        username: 'username',
        barcode: 'barcode',
        robotSerialNumber: 'robotSerialNumber',
        failureType: 'failureType',
      }
    })

    it('on success it shows an alertx', async () => {
      page.showAlert = jest.fn()
      lighthouse.failDestinationPlate.mockReturnValue({
        success: true,
        response: 'A successful response message',
      })

      await page.fail(form)
      expect(page.showAlert).toHaveBeenCalledWith('A successful response message', 'success')
    })

    it('on partial success it shows an alert', async () => {
      page.showAlert = jest.fn()
      lighthouse.failDestinationPlate.mockReturnValue({
        success: true,
        errors: ['A error message'],
      })

      await page.fail(form)
      expect(page.showAlert).toHaveBeenCalledWith('A error message', 'warning')
    })

    it('on failure calls showAlert', async () => {
      page.showAlert = jest.fn()
      lighthouse.failDestinationPlate.mockReturnValue({
        success: false,
        errors: ['an error'],
      })

      await page.fail(form)
      expect(page.showAlert).toHaveBeenCalledWith('an error', 'danger')
    })
  })

  describe('alert', () => {
    it('has a alert', () => {
      expect(wrapper.findComponent(Alert).exists()).toBeTruthy()
    })
  })

  describe('#showAlert', () => {
    it('calls alert show', () => {
      const parent = shallowMount(BeckmanCherrypick, {
        localVue,
      })

      parent.vm.$refs.alert.show = jest.fn()
      parent.vm.showAlert('message', 'success')
      expect(parent.vm.$refs.alert.show).toHaveBeenCalled()
    })
  })
})
