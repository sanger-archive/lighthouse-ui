import { createLocalVue, shallowMount } from '@vue/test-utils'
import { BootstrapVue } from 'bootstrap-vue'
import AlertDialog from '@/components/AlertDialog'
import lighthouse from '@/modules/lighthouse_service'
import lighthouseBiosero from '@/modules/lighthouse_service_biosero'
import BioseroCherrypick from '@/pages/biosero_cherrypick.vue'
jest.mock('@/modules/lighthouse_service')
jest.mock('@/modules/lighthouse_service_biosero')

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('Biosero Cherrypick', () => {
  let wrapper, page, failureTypes

  beforeEach(() => {
    failureTypes = [
      { type: 'Type 1', description: 'Description of error 1' },
      { type: 'Type 2', description: 'Description of error 2' },
    ]

    lighthouse.getFailureTypes.mockReturnValue({
      success: true,
      failureTypes,
    })

    wrapper = shallowMount(BioseroCherrypick, {
      localVue,
    })
    page = wrapper.vm
  })

  it('is a Vue instance', () => {
    expect(wrapper.findComponent(BioseroCherrypick).exists()).toBeTruthy()
  })

  describe('mounted', () => {
    it('calls lighthouse initialiser methods', () => {
      expect(lighthouse.getFailureTypes).toHaveBeenCalled()
    })
  })

  describe('data', () => {
    it('has failure types data', () => {
      expect(page.failureTypes).toEqual(failureTypes)
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
        errors: ['No information exists for any Biosero failure types'],
        failureTypes: [],
      })

      await page.getFailureTypes()
      expect(page.failureTypes).toHaveLength(0)
      expect(page.showAlert).toHaveBeenCalledWith(
        'No information exists for any Biosero failure types',
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
      }
    })

    it('on success it shows an alert', async () => {
      page.showAlert = jest.fn()
      lighthouseBiosero.createDestinationPlateBiosero.mockReturnValue({
        success: true,
        response: 'A successful response message',
      })

      await page.create(form)
      expect(page.showAlert).toHaveBeenCalledWith('A successful response message', 'success')
    })

    it('on failure calls showAlert', async () => {
      page.showAlert = jest.fn()
      lighthouseBiosero.createDestinationPlateBiosero.mockReturnValue({
        success: false,
        error: {
          message: 'an error',
        },
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
        failureType: 'failureType',
      }
    })

    it('on success it shows an alert', async () => {
      page.showAlert = jest.fn()
      lighthouseBiosero.failDestinationPlateBiosero.mockReturnValue({
        success: true,
        response: 'A successful response message',
      })

      await page.fail(form)
      expect(page.showAlert).toHaveBeenCalledWith('A successful response message', 'success')
    })

    it('on failure calls showAlert', async () => {
      page.showAlert = jest.fn()
      lighthouseBiosero.failDestinationPlateBiosero.mockReturnValue({
        success: false,
        error: {
          message: 'An error message',
        },
      })

      await page.fail(form)
      expect(page.showAlert).toHaveBeenCalledWith('An error message', 'danger')
    })
  })

  describe('alert', () => {
    it('has a alert', () => {
      expect(wrapper.findComponent(AlertDialog).exists()).toBeTruthy()
    })
  })

  describe('#showAlert', () => {
    it('calls alert show', () => {
      const parent = shallowMount(BioseroCherrypick, {
        localVue,
      })

      parent.vm.$refs.alert.show = jest.fn()
      parent.vm.showAlert('message', 'success')
      expect(parent.vm.$refs.alert.show).toHaveBeenCalled()
    })
  })
})
