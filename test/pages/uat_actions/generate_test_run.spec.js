import { createLocalVue, mount } from '@vue/test-utils'
import { BootstrapVue } from 'bootstrap-vue'
import flushPromises from 'flush-promises'
import GenerateTestRun from '@/pages/uat_actions/generate_test_run.vue'
import lighthouse from '@/modules/lighthouse_service'
import AlertDialog from '@/components/AlertDialog'
import statuses from '@/modules/statuses'

jest.mock('@/modules/lighthouse_service')

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('UAT Actions', () => {
  let wrapper, page

  beforeEach(() => {
    wrapper = mount(GenerateTestRun, {
      localVue,
    })
    page = wrapper.vm
  })

  it('is a Vue instance', () => {
    expect(wrapper.findComponent(GenerateTestRun).exists()).toBeTruthy()
  })

  // view
  describe('form', () => {
    it('is displayed when the maximum plates is not reached', () => {
      expect(wrapper.find('#platesSpecForm').exists()).toBe(true)
      expect(wrapper.find('#maximumPlateMessage').exists()).not.toBe(true)
    })

    it('is not displayed when the maximum plates is reached', () => {
      wrapper.vm.maxNumberOfPlates = 2
      wrapper.vm.plateSpecs = [
        { numberOfPlates: 1, numberOfPositives: 1 },
        { numberOfPlates: 1, numberOfPositives: 3 },
      ]

      wrapper.vm.$nextTick(() => {
        expect(wrapper.find('#platesSpecForm').exists()).toBe(false)
        expect(wrapper.find('#maximumPlateMessage').exists()).toBe(true)
      })
    })
  })

  // components
  describe('alert', () => {
    it('has an alert', () => {
      expect(wrapper.findComponent(AlertDialog).exists()).toBeTruthy()
    })
  })

  // data
  describe('data', () => {
    it('has default values', () => {
      expect(page.form).toEqual({
        numberOfPlates: 1,
        numberOfPositives: 0,
      })
      expect(page.addToDart).toBe(false)
      expect(page.plateSpecs).toEqual([])
      expect(wrapper.vm.status).toEqual(statuses.Idle)
    })
  })

  // computed
  describe('totalPlates', () => {
    it('totals the number of plates', () => {
      wrapper.vm.plateSpecs = [
        { numberOfPlates: 2, numberOfPositives: 1 },
        { numberOfPlates: 11, numberOfPositives: 3 },
      ]
      expect(wrapper.vm.totalPlates).toEqual(2 + 11)
    })
  })

  describe('isBusy', () => {
    it('default is not busy', () => {
      expect(wrapper.vm.isBusy).toBeFalsy()
    })

    it('when busy', () => {
      wrapper.vm.status = statuses.Busy
      expect(wrapper.vm.isBusy).toBeTruthy()
    })
  })

  describe('isValid', () => {
    it('default is not busy', () => {
      expect(wrapper.vm.isValid).toBeFalsy()
    })

    it('when valid', () => {
      wrapper.vm.plateSpecs = [
        { numberOfPlates: 2, numberOfPositives: 1 },
        { numberOfPlates: 11, numberOfPositives: 3 },
      ]
      expect(wrapper.vm.isValid).toBeTruthy()
    })
  })

  // methods
  describe('#numberOfPositivesOptions', () => {
    it('has a default', () => {
      expect(wrapper.vm.numberOfPositivesOptions()).toHaveLength(97)
    })
  })

  describe('#numberOfPlatesOptions', () => {
    it('has a default', () => {
      expect(wrapper.vm.numberOfPlatesOptions()).toHaveLength(200)
    })
  })

  describe('#add', () => {
    it('when plateSpecs is an empty list', async () => {
      wrapper = mount(GenerateTestRun, {
        localVue,
        data() {
          return {
            form: { numberOfPlates: 1, numberOfPositives: 2 },
          }
        },
      })

      await wrapper.find('#addButton').trigger('click')

      expect(wrapper.vm.plateSpecs).toEqual([{ numberOfPlates: 1, numberOfPositives: 2 }])
      expect(wrapper.vm.form.numberOfPlates).toBe(1)
      expect(wrapper.vm.form.numberOfPositives).toBe(0)
    })

    it('when plateSpecs is not empty', async () => {
      wrapper = mount(GenerateTestRun, {
        localVue,
        data() {
          return {
            plateSpecs: [{ numberOfPlates: 1, numberOfPositives: 2 }],
            form: { numberOfPlates: 3, numberOfPositives: 4 },
          }
        },
      })

      await wrapper.find('#addButton').trigger('click')

      expect(wrapper.vm.plateSpecs).toEqual([
        { numberOfPlates: 1, numberOfPositives: 2 },
        { numberOfPlates: 3, numberOfPositives: 4 },
      ])
      expect(wrapper.vm.form.numberOfPlates).toBe(1)
      expect(wrapper.vm.form.numberOfPositives).toBe(0)
    })

    it('when adding another entry with the same number of positives as an already existing plate spec and that they remain in insertion order', async () => {
      wrapper = mount(GenerateTestRun, {
        localVue,
        data() {
          return {
            plateSpecs: [{ numberOfPlates: 1, numberOfPositives: 4 }],
            form: { numberOfPlates: 3, numberOfPositives: 4 },
          }
        },
      })

      await wrapper.find('#addButton').trigger('click')

      expect(wrapper.vm.plateSpecs).toEqual([
        { numberOfPlates: 1, numberOfPositives: 4 },
        { numberOfPlates: 3, numberOfPositives: 4 },
      ])
      expect(wrapper.vm.form.numberOfPlates).toBe(1)
      expect(wrapper.vm.form.numberOfPositives).toBe(0)
    })
  })

  describe('setting the status', () => {
    it('default should be idle', () => {
      expect(wrapper.vm.status).toEqual(statuses.Idle)
    })
  })

  describe('#reset', () => {
    it('resets plateSpecs', async () => {
      wrapper = mount(GenerateTestRun, {
        localVue,
        data() {
          return {
            plateSpecs: [{ numberOfPlates: 1, numberOfPositives: 2 }],
          }
        },
      })

      const button = wrapper.find('#resetButton')
      const modal = wrapper.find('#resetModal')

      expect(modal.isVisible()).toBe(false)
      await button.trigger('click')

      expect(modal.isVisible()).toBe(true)
    })
  })

  describe('#resetPlateSpecs', () => {
    it('resets the plates spec', () => {
      wrapper = mount(GenerateTestRun, {
        localVue,
        data() {
          return {
            plateSpecs: [
              { numberOfPlates: 2, numberOfPositives: 1 },
              { numberOfPlates: 11, numbeOfPpositives: 3 },
            ],
          }
        },
      })

      wrapper.vm.resetPlateSpecs()
      expect(wrapper.vm.plateSpecs).toEqual([])
    })
  })

  describe('#showAlert', () => {
    it('calls alert show', () => {
      wrapper.vm.$refs.alert.show = jest.fn()
      wrapper.vm.showAlert('message', 'success')
      expect(wrapper.vm.$refs.alert.show).toHaveBeenCalled()
    })
  })

  describe('#generateTestRun', () => {
    let wrapper

    beforeEach(() => {
      const $router = {
        push: jest.fn(),
      }

      wrapper = mount(GenerateTestRun, {
        localVue,
        mocks: {
          $router,
        },
        data() {
          return {
            plateSpecs: [{ numberOfPlates: 1, numberOfPositives: 2 }],
          }
        },
      })
      wrapper.vm.showAlert = jest.fn()
    })

    it('when the request is successful', async () => {
      lighthouse.generateTestRun.mockResolvedValue({
        success: true,
        runId: 'anId123',
      })

      await wrapper.find('#generateTestRunButton').trigger('click')
      expect(lighthouse.generateTestRun).toHaveBeenCalledWith(
        [{ numberOfPlates: 1, numberOfPositives: 2 }]
      )
      expect(wrapper.vm.$router.push).toHaveBeenCalled()
      expect(wrapper.vm.showAlert).not.toHaveBeenCalled()
    })

    it('when the request fails', async () => {
      lighthouse.generateTestRun.mockResolvedValue({
        success: false,
        error: 'There was an error',
      })

      await wrapper.find('#generateTestRunButton').trigger('click')
      expect(lighthouse.generateTestRun).toHaveBeenCalledWith(
        [{ numberOfPlates: 1, numberOfPositives: 2 }]
      )
      expect(wrapper.vm.showAlert).toHaveBeenCalledWith('There was an error', 'danger')
    })

    it('updates the status and spinner', async () => {
      lighthouse.generateTestRun.mockReturnValue({
        success: true,
        runId: 'anId123',
      })

      expect(wrapper.vm.status).toEqual(statuses.Idle)
      expect(wrapper.find('#busySpinner').isVisible()).toBe(false)

      // We dont want to await here because we want to test the status and components
      // while the promise is being processed.
      wrapper.find('#generateTestRunButton').trigger('click')
      expect(wrapper.vm.status).toEqual(statuses.Busy)

      // We need to go to the next tick to see the computed spinner.
      await wrapper.vm.$nextTick()
      expect(wrapper.find('#busySpinner').isVisible()).toBe(true)

      // Completely flush the promises to see that the request returned to idle status.
      await flushPromises()
      expect(wrapper.vm.status).toEqual(statuses.Idle)
      expect(wrapper.find('#busySpinner').isVisible()).toBe(false)
    })
  })
})
