import { createLocalVue, mount } from '@vue/test-utils'
import { BootstrapVue } from 'bootstrap-vue'
import TestRuns from '@/pages/uat_actions/test_runs'
import lighthouse from '@/modules/lighthouse_service'

jest.mock('@/modules/lighthouse_service')

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('TestRuns.vue', () => {
  let wrapper, testRunsData

  // data
  describe('data', () => {
    beforeEach(() => {
      wrapper = mount(TestRuns, {
        localVue,
      })
      lighthouse.getTestRuns.mockResolvedValue({})
    })
    it('will have fields', () => {
      const expected = ['_created', 'status', 'add_to_dart', 'total_plates', 'actions']
      expect(wrapper.vm.fields).toEqual(expected)
    })
  })

  describe('table', () => {
    beforeEach(() => {
      wrapper = mount(TestRuns, {
        localVue,
      })
      testRunsData = {
        success: true,
        response: [
          {
            _id: 1,
            status: 'completed',
            add_to_dart: true,
            _created_at: '2020-05-13 11:00:00 UTC',
          },
          {
            _id: 2,
            status: 'completed',
            add_to_dart: true,
            _created_at: '2020-05-13 11:00:00 UTC',
          },
        ],
        total: 23,
      }
      lighthouse.getTestRuns.mockResolvedValue(testRunsData)
    })

    it('will have a table', () => {
      expect(wrapper.find('table').exists()).toBeTruthy()
    })

    it('contains a view run button for each row', () => {
      expect(wrapper.find('#viewTestRun-1').text()).toBe('View')
      expect(wrapper.find('#viewTestRun-2').text()).toBe('View')
    })
  })

  describe('#getTestRuns successful', () => {
    beforeEach(() => {
      wrapper = mount(TestRuns, {
        localVue,
      })
      testRunsData = {
        success: true,
        response: [
          {
            _id: 111111,
            status: 'completed',
            add_to_dart: true,
            _created_at: '2020-05-13 11:00:00 UTC',
          },
          {
            _id: 211111,
            status: 'completed',
            add_to_dart: true,
            _created_at: '2020-05-10 10:00:00 UTC',
          },
          {
            _id: 311111,
            status: 'completed',
            add_to_dart: true,
            _created_at: '2020-05-10 10:00:00 UTC',
          },
        ],
        total: 23,
      }
      lighthouse.getTestRuns.mockResolvedValue(testRunsData)
    })

    it('has a table with runs', () => {
      expect(wrapper.vm.totalRows).toBe(23)
      expect(wrapper.find('tbody').findAll('tr')).toHaveLength(testRunsData.response.length)
    })
  })

  describe('#getTestRuns unsuccessful', () => {
    beforeEach(() => {
      wrapper = mount(TestRuns, {
        localVue,
      })
      testRunsData = {
        success: false,
        total: 0,
        error: 'An error',
      }
      lighthouse.getTestRuns.mockResolvedValue(testRunsData)
      wrapper.vm.$refs.alert.show = jest.fn()
    })

    it('has a table with no runs', () => {
      expect(wrapper.vm.totalRows).toBe(0)
      expect(wrapper.find('tbody').findAll('tr')).toHaveLength(0)
      expect(wrapper.vm.$refs.alert.show).toHaveBeenCalledWith('An error', 'danger')
    })
  })

  describe('#getTestRuns failure', () => {
    beforeEach(() => {
      wrapper = mount(TestRuns, {
        localVue,
      })
      testRunsData = {
        success: false,
        totoal: 0,
      }
      lighthouse.getTestRuns.mockImplementationOnce(() =>
        Promise.reject(new Error('There was an error'))
      )
      wrapper.vm.$refs.alert.show = jest.fn()
    })

    it('calls the catch block', () => {
      expect(wrapper.vm.totalRows).toBe(0)
      expect(wrapper.find('tbody').findAll('tr')).toHaveLength(0)
      expect(wrapper.vm.$refs.alert.show).toHaveBeenCalledWith(
        'An unknown error has occurred',
        'danger'
      )
    })
  })

  describe('#showAlert', () => {
    it('calls alert show', () => {
      wrapper.vm.$refs.alert.show = jest.fn()
      wrapper.vm.showAlert('message', 'success')
      expect(wrapper.vm.$refs.alert.show).toHaveBeenCalled()
    })
  })
})
