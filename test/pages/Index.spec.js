import BootstrapVue from 'bootstrap-vue'
import { mount, createLocalVue } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import ReportsJson from '../data/reports'
import Index from '@/pages/index.vue'
import statuses from '@/modules/statuses'
import lighthouse from '@/modules/lighthouse_service'

// Mock the whole module. Returning jest.fn() allows you to mock methods here
// jest.mock('@/modules/lighthouse_service', () => jest.fn())
jest.mock('@/modules/lighthouse_service')

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('Index', () => {
  let wrapper

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('is a Vue instance', () => {
    lighthouse.getReports.mockResolvedValue({
      success: true,
      reports: ReportsJson.reports
    })
    wrapper = mount(Index, { localVue })
    expect(wrapper.findComponent(Index).exists()).toBeTruthy()
  })

  describe('setting the status', () => {
    let index

    it('default should be idle', () => {
      lighthouse.getReports.mockResolvedValue({
        success: true,
        reports: ReportsJson.reports
      })
      index = mount(Index, { localVue }).vm
      expect(index.isIdle).toBeTruthy()
    })

    it('when success', () => {
      wrapper = mount(Index, {
        localVue,
        data() {
          return {
            status: statuses.Success,
            alertMessage: 'I am a success'
          }
        }
      })
      index = wrapper.vm
      expect(index.isSuccess).toBeTruthy()
      expect(wrapper.find('.alert').text()).toMatch('I am a success')
    })

    it('when error', () => {
      wrapper = mount(Index, {
        localVue,
        data() {
          return {
            status: statuses.Error,
            alertMessage: 'I am a failure'
          }
        }
      })
      index = wrapper.vm
      expect(index.isError).toBeTruthy()
      expect(wrapper.find('.alert').text()).toMatch('I am a failure')
    })

    it('when busy', () => {
      wrapper = mount(Index, {
        localVue,
        data() {
          return {
            status: statuses.Busy,
            alertMessage: 'I am busy'
          }
        }
      })
      index = wrapper.vm
      expect(index.isBusy).toBeTruthy()
      expect(wrapper.find('.alert').text()).toMatch('I am busy')
    })
  })

  describe('#reportsProvider', () => {
    it('when the request is successful', async () => {
      lighthouse.getReports.mockResolvedValue({
        success: true,
        reports: ReportsJson.reports
      })
      wrapper = mount(Index, { localVue })
      await flushPromises()
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(
        ReportsJson.reports.length
      )
    })

    it('when the request fails', async () => {
      lighthouse.getReports.mockReturnValue({
        success: false,
        error: 'There was an error'
      })
      wrapper = mount(Index, { localVue })
      await flushPromises()
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(0)
    })
  })

  describe('#createReport', () => {
    it('when the request is successful', async () => {
      lighthouse.createReport.mockResolvedValue({
        success: true,
        reports: [ReportsJson.reports[0]]
      })
      lighthouse.getReports.mockResolvedValue({
        success: true,
        reports: ReportsJson.reports
      })
      const wrapper = mount(Index, { localVue })
      const button = wrapper.find('#createReport')
      await button.trigger('click')
      await flushPromises()
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(
        ReportsJson.reports.length
      )
      expect(wrapper.find('.alert').text()).toMatch(
        'Report successfully created'
      )
    })

    it('when the request fails', async () => {
      lighthouse.createReport.mockReturnValue({
        success: false,
        error: 'There was an error'
      })
      const wrapper = mount(Index, { localVue })
      const button = wrapper.find('#createReport')
      await button.trigger('click')
      await flushPromises()
      expect(wrapper.find('.alert').text()).toMatch(
        'There was an error creating the report'
      )
    })
  })

  // TODO: Again would be better with an integration test
  // I also think this the complexity of this test is a bit of a code smell. Defo needs a refactor
  describe('#deleteReports', () => {
    let rows, reportFilenames, lessReportsJson

    beforeEach(() => {
      reportFilenames = ReportsJson.reports
        .map((report) => report.filename)
        .slice(0, 3)
      lessReportsJson = { reports: ReportsJson.reports.slice(3, 5) }
      lighthouse.getReports.mockResolvedValue({
        success: true,
        reports: ReportsJson.reports
      })
    })

    it('when the request is successful', async () => {
      lighthouse.deleteReports.mockResolvedValue({ success: true })
      const wrapper = mount(Index, { localVue })
      await flushPromises()
      rows = wrapper.find('tbody').findAll('tr')
      const arr = [0, 1, 2]
      arr.forEach((i) => {
        rows
          .at(i)
          .find('.selected input[type="checkbox"]')
          .setChecked(true)
      })
      expect(wrapper.vm.reportsToDelete).toEqual(reportFilenames)
      lighthouse.getReports.mockResolvedValue({
        success: true,
        reports: lessReportsJson.reports
      })
      const button = wrapper.find('#deleteReports')
      await button.trigger('click')
      await flushPromises()
      expect(wrapper.text()).toMatch(/Reports successfully deleted/)
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(2)
    })

    it('when the request fails', async () => {
      lighthouse.deleteReports.mockResolvedValue({
        success: false,
        error: 'There was an error'
      })
      const wrapper = mount(Index, { localVue })
      await flushPromises()
      rows = wrapper.find('tbody').findAll('tr')
      rows
        .at(0)
        .find('.selected input[type="checkbox"]')
        .setChecked(true)
      expect(wrapper.vm.reportsToDelete.length).toEqual(1)
      const button = wrapper.find('#deleteReports')
      await button.trigger('click')
      await flushPromises()
      expect(wrapper.find('.alert').text()).toMatch('There was an error')
    })
  })
})
