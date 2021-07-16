import TestRuns from '@/pages/uat_actions/test_runs'
import { createLocalVue, mount } from '@vue/test-utils'
import { BootstrapVue } from 'bootstrap-vue'
import lighthouse from '@/modules/lighthouse_service'

jest.mock('@/modules/lighthouse_service')

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('TestRuns.vue', () => {
  let wrapper, page, testRunsData

  beforeEach(() => {
    testRunsData = {
      "success": true,
      "response": [
        { _id: 111111, status: 'completed', 'add_to_dart': true, _created_at: '2020-05-13 11:00:00 UTC' },
        { _id: 211111, status: 'completed', 'add_to_dart': true, _created_at: '2020-05-10 10:00:00 UTC' },
        { _id: 311111, status: 'completed', 'add_to_dart': true, _created_at: '2020-05-10 10:00:00 UTC' },
      ],
      "total": 23
    }

    wrapper = mount(TestRuns, {
      localVue,
    })
    page = wrapper.vm
    lighthouse.getTestRuns.mockResolvedValue(testRunsData)
  })

  // data
  describe('data', () => {
    it('will have fields', () => {
      const expected = ['_created', 'status', 'add_to_dart', 'actions']
      expect(page.fields).toEqual(expected)
    })
  })

  it('will have a table', () => {
    expect(wrapper.find('table').exists()).toBeTruthy()
  })

  it('will have a table with runs', () => {
    expect(wrapper.find('tbody').findAll('tr')).toHaveLength(testRunsData.response.length)
  })

  describe('View run button', () => {
    it('contains a view run button', () => {
      expect(wrapper.find('#viewTestRun-111111').text()).toEqual('View')
    })

    it('will redirect to the test run when View is clicked', () => {
      const button = wrapper.find('#viewTestRun-111111')
      button.trigger('click')
      expect(true).toBeTruthy()
      // TODO: add test for path
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