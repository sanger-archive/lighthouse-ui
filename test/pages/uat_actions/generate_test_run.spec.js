import { createLocalVue, mount } from '@vue/test-utils'
import { BootstrapVue } from 'bootstrap-vue'
import GenerateTestRun from '@/pages/uat_actions/generate_test_run.vue'
import lighthouse from '@/modules/lighthouse_service'
import Alert from '@/components/Alert'
import flushPromises from 'flush-promises'

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

  // components
  describe('alert', () => {
    it('has a alert', () => {
      expect(wrapper.findComponent(Alert).exists()).toBeTruthy()
    })
  })

  // data
  describe('data', () => {
    it('has default values', () => {
      expect(page.form).toEqual({
        numberOfPlates: 1,
        numberOfPositives: 0,
      })
      expect(page.addToDart).toEqual(false)
      expect(page.plateSpecs).toEqual([])
    })
  })

  // computed
  describe('totalPlates', () => {
    it('totals the number of plates', () => {
      wrapper = mount(GenerateTestRun, {
        localVue,
        data() {
          return {
            plateSpecs: [{ numberOfPlates: 2, numberOfPositives: 1 }, { numberOfPlates: 11, numbeOfPpositives: 3 }],
          }
        },
      })

      expect(wrapper.vm.totalPlates).toEqual(2 + 11)
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
      expect(wrapper.vm.form.numberOfPlates).toEqual(1)
      expect(wrapper.vm.form.numberOfPositives).toEqual(0)
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

      expect(wrapper.vm.plateSpecs).toEqual([{ numberOfPlates: 1, numberOfPositives: 2 }, { numberOfPlates: 3, numberOfPositives: 4 }])
      expect(wrapper.vm.form.numberOfPlates).toEqual(1)
      expect(wrapper.vm.form.numberOfPositives).toEqual(0)
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

      expect(modal.isVisible()).toBe(false);
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
            plateSpecs: [{ numberOfPlates: 2, numberOfPositives: 1 }, { numberOfPlates: 11, numbeOfPpositives: 3 }],
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
        push: jest.fn()
      }

      wrapper = mount(GenerateTestRun, {
        localVue,
        mocks: {
          $router,
        },
        data() {
          return {
            plateSpecs: [{ numberOfPlates: 1, numberOfPositives: 2 }],
            addToDart: true,
          }
        },
      })

    })
    it('when the request is successful', async () => {
      lighthouse.generateTestRun.mockResolvedValue({
        success: true,
        runId: 'anId123'
      })

      wrapper.vm.showAlert = jest.fn()

      await wrapper.find('#generateTestRunButton').trigger('click')
      await flushPromises()
      expect(lighthouse.generateTestRun).toHaveBeenCalledWith([{ numberOfPlates: 1, numberOfPositives: 2 }], true)
      expect(wrapper.vm.$router.push).toHaveBeenCalled()
      expect(wrapper.vm.showAlert).not.toHaveBeenCalled()
    })

    it('when the request fails', async () => {
      lighthouse.generateTestRun.mockReturnValue({
        success: false,
        error: 'There was an error',
      })

      await wrapper.find('#generateTestRunButton').trigger('click')
      await flushPromises()
      expect(lighthouse.generateTestRun).toHaveBeenCalledWith([{ numberOfPlates: 1, numberOfPositives: 2 }], true)
      expect(wrapper.find("#alert").text()).toMatch('There was an error')
    })
  })
})
