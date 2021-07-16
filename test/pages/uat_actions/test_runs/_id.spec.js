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
  let wrapper, page, testRunData

  beforeEach(() => {
    testRunData = {
      "id": 1,
      "created_at": "2021-07-02T09:00:00.000Z",
      "updated_at": "2021-07-12T11:31:15.806Z",
      "status": "completed",
      "plate_specs": "[[2,48]]",
      "add_to_dart": false,
      "barcodes": "[[\"TEST-112408\", \"number of positives: 0\"]]"
    }

    const $route = {
      params: {
        id: 1
      }
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
    page = wrapper.vm
  })

  // data
  describe('data', () => {
    it('will have fields', () => {
      const expected = ['barcode', { key: 'text', label: 'Description' }, 'actions']
      expect(page.fields).toEqual(expected)
    })
  })

  it('will have a table', () => {
    expect(wrapper.find('table').exists()).toBeTruthy()
  })

  it('will have a table with run information', () => {
    // page.getTestRuns = jest.fn().mockReturnValue(testRunData)
    expect(wrapper.find('tbody').findAll('tr')).toHaveLength(1)
  })

  describe('#showAlert', () => {
    it('calls alert show', () => {
      page.$refs.alert.show = jest.fn()
      page.showAlert('message', 'success')
      expect(page.$refs.alert.show).toHaveBeenCalled()
    })
  })

  describe('#print', () => {
    it('successfully', async () => {
      sprint.printLabels.mockReturnValue({
        success: true,
        message: 'Labels successfully printed',
      })
      await page.print()
      expect(sprint.printLabels).toHaveBeenCalled()
      expect(wrapper.find('.alert').text()).toMatch('Labels successfully printed')
    })

    it('unsuccessfully', async () => {
      sprint.printLabels.mockReturnValue({
        success: false,
        error: 'There was an error',
      })
      await page.print()
      expect(wrapper.find('.alert').text()).toMatch('There was an error')
    })
  })
})