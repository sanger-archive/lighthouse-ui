import TestRun from '@/pages/uat_actions/test_runs/_id'
import { createLocalVue, mount } from '@vue/test-utils'
import { BootstrapVue } from 'bootstrap-vue'
import lighthouse from '@/modules/lighthouse_service'
import sprint from '@/modules/sprint'

jest.mock('@/modules/lighthouse_service')
jest.mock('@/modules/sprint')

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('TestRuns.vue', () => {
  let wrapper, testRunData, $route

  beforeEach(() => {
    $route = {
      params: {
        id: 1
      }
    }
    testRunData = {
      "_id": 1,
      "_created_at": "2021-07-02T09:00:00.000Z",
      "_updated_at": "2021-07-12T11:31:15.806Z",
      "status": "completed",
      "plate_specs": "[[2,48]]",
      "add_to_dart": false,
      "barcodes": "[[\"TEST-111\", \"number of positives: 1\"],[\"TEST-222\", \"number of positives: 2\"]]"
    }

    lighthouse.getTestRun.mockResolvedValue({ success: true, response: testRunData })

    wrapper = mount(TestRun, {
      localVue,
      mocks: {
        $route
      },
      data() {
        return {
          printerSelected: 'heron-bc1',
        }
      },
    })
  })

  describe('table', () => {
    it('will have fields', () => {
      const expected = ['barcode', { key: 'text', label: 'Description' }, 'actions']
      expect(wrapper.vm.fields).toEqual(expected)
    })

    it('will have a table', () => {
      expect(wrapper.find('table').exists()).toBeTruthy()
    })

    it('contains a print button for each row', () => {
      expect(wrapper.find('#print-TEST-111').text()).toEqual('Print')
      expect(wrapper.find('#print-TEST-222').text()).toEqual('Print')
    })

  })

  describe('#created successful', () => {
    it('will have a table', () => {
      expect(wrapper.find('table').exists()).toBeTruthy()
    })

    it('will have a table with run information', () => {
      expect(wrapper.vm.run).toEqual(testRunData)
      expect(wrapper.find('tbody').findAll('tr')).toHaveLength(2)
    })
  })

  describe('#created unsuccessful', () => {
    beforeEach(() => {
      lighthouse.getTestRun.mockResolvedValue({ success: false, error: "An error" })

      wrapper = mount(TestRun, {
        localVue,
        mocks: {
          $route
        },
      })
      wrapper.vm.$refs.alert.show = jest.fn()
    })
    it('will have a table with run information', () => {
      expect(wrapper.vm.run).toEqual({})
      expect(wrapper.vm.$refs.alert.show).toHaveBeenCalledWith("An error", "danger")
    })
  })

  describe('#showAlert', () => {
    it('calls alert show', () => {
      wrapper.vm.$refs.alert.show = jest.fn()
      wrapper.vm.showAlert('message', 'success')
      expect(wrapper.vm.$refs.alert.show).toHaveBeenCalled()
    })
  })

  describe('#print', () => {
    it('successfully', async () => {
      sprint.printLabels.mockReturnValue({
        success: true,
        message: 'Labels successfully printed',
      })
      await wrapper.vm.print()
      expect(sprint.printLabels).toHaveBeenCalled()
      expect(wrapper.find('.alert').text()).toMatch('Labels successfully printed')
    })

    it('unsuccessfully', async () => {
      sprint.printLabels.mockReturnValue({
        success: false,
        error: 'There was an error',
      })
      await wrapper.vm.print()
      expect(wrapper.find('.alert').text()).toMatch('There was an error')
    })
  })
})
