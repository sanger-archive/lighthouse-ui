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
    testRunsData = [
      { id: 111111, status: 'completed', 'plates_spec': [], 'add_to_dart': true, 'barcodes': '', created_at: '2020-05-13 11:00:00 UTC', updated_at: '2020-05-13 11:00:00 UTC' },
      { id: 211111, status: 'completed', 'plates_spec': [], 'add_to_dart': true, 'barcodes': '', created_at: '2020-05-10 10:00:00 UTC', updated_at: '2020-05-10 10:00:00 UTC' },
      { id: 311111, status: 'completed', 'plates_spec': [], 'add_to_dart': true, 'barcodes': '', created_at: '2020-05-10 10:00:00 UTC', updated_at: '2020-05-10 10:00:00 UTC' },
    ]

    wrapper = mount(TestRuns, {
      localVue,
    })
    page = wrapper.vm
    lighthouse.getTestRuns.mockResolvedValue({ response: testRunsData })
  })


  // data
  describe('data', () => {
    it('will have fields', () => {
      let expected = ['id', 'created_at', 'updated_at', 'status', 'plate_specs', 'add_to_dart', 'barcodes', 'actions']
      expect(page.fields).toEqual(expected)
    })
  })

  it('will have a table', () => {
    expect(wrapper.find('table').exists()).toBeTruthy()
  })

  it('will have a table with runs', () => {
    page.getTestRuns = jest.fn().mockReturnValue(testRunsData)
    expect(wrapper.find('tbody').findAll('tr').length).toEqual(testRunsData.length)
  })

  describe('View run button', () => {
    it('contains a view run button', () => {
      expect(wrapper.find('#viewTestRun-111111').text()).toEqual('View')
    })

    it('will redirect to the test run when View is clicked', async () => {
      let button = wrapper.find('#viewTestRun-111111')
      button.trigger('click')
      // TODO
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