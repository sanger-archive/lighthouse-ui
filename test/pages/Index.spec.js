import BootstrapVue from 'bootstrap-vue'
import { mount, createLocalVue } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import axios from 'axios'
import ReportsJson from '../data/reports'
import Index from '@/pages/index.vue'
import statuses from '@/modules/statuses'

const $axios = {
  $get: jest.fn(),
  $post: jest.fn()
}

const process = {
  env: {
    LIGHTHOUSE_BASE_URL: 'lighthouse'
  }
}

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('Index', () => {
  let wrapper

  beforeEach(() => {
    $axios.$get = jest.fn()
    $axios.$post = jest.fn()
  })

  it('is a Vue instance', () => {
    wrapper = mount(Index, { localVue })
    expect(wrapper.findComponent(Index).exists()).toBeTruthy()
  })

  describe('setting the status', () => {
    let index

    it('default should be idle', () => {
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
    beforeEach(() => {
      wrapper = mount(Index, { localVue, mocks: { $axios, process } })
    })

    it('when the request is successful', async () => {
      $axios.$get.mockResolvedValue(ReportsJson)
      wrapper = mount(Index, { localVue, mocks: { $axios, process } })
      await flushPromises()
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(
        ReportsJson.reports.length
      )
    })

    it('when the request fails', async () => {
      $axios.$get.mockImplementationOnce(() =>
        Promise.reject(new Error('There was an error'))
      )
      wrapper = mount(Index, { localVue, mocks: { $axios, process } })
      await flushPromises()
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(0)
    })
  })

  describe('#createReport', () => {
    it('when the request is successful', async () => {
      $axios.$post.mockResolvedValue('success')
      $axios.$get.mockResolvedValue(ReportsJson)
      const wrapper = mount(Index, { localVue, mocks: { $axios, process } })
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
      $axios.$post.mockImplementationOnce(() =>
        Promise.reject(new Error('There was an error'))
      )
      const wrapper = mount(Index, { localVue, mocks: { $axios, process } })
      const button = wrapper.find('#createReport')
      await button.trigger('click')
      await flushPromises()
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(0)
      expect(wrapper.find('.alert').text()).toMatch(
        'There was an error creating the report'
      )
    })
  })

  // TODO: Again would be better with an integration test
  // I also think this the complexity of this test is a bit of a code smell. Defo needs a refactor
  describe('#deleteReports', () => {
    let rows, reportFilenames

    beforeEach(() => {
      axios.post = jest.fn()
      reportFilenames = ReportsJson.reports
        .map((report) => report.filename)
        .slice(0, 3)
      $axios.$get.mockResolvedValue(ReportsJson)
    })

    it('when the request is successful', async () => {
      axios.post.mockResolvedValue('success')
      const wrapper = mount(Index, { localVue, mocks: { $axios, process } })
      await flushPromises()
      rows = wrapper.find('tbody').findAll('tr')
      const arr = [0, 1, 2]
      arr.forEach((i) => {
        rows
          .at(i)
          .find('.selected input[type="checkbox"]')
          .setChecked(true)
      })
      expect(wrapper.vm.reportsToDelete.length).toEqual(3)
      expect(wrapper.vm.reportsToDelete).toEqual(reportFilenames)
      const button = wrapper.find('#deleteReports')
      await button.trigger('click')
      await flushPromises()
      expect(wrapper.text()).toMatch(/Reports successfully deleted/)
    })

    it('when the request fails', async () => {
      axios.post.mockImplementationOnce(() =>
        Promise.reject(new Error('There was an error'))
      )
      const wrapper = mount(Index, { localVue, mocks: { $axios, process } })
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
      expect(wrapper.find('.alert').text()).toMatch('Error: There was an error')
    })
  })
})
