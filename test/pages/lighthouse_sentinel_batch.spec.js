import BootstrapVue from 'bootstrap-vue'
import { mount, createLocalVue } from '@vue/test-utils'
import LabwaresJson from '../data/labwhere_locations_with_children'
import LighthouseSentinelBatch from '@/pages/lighthouse_sentinel_batch'

const $axios = {
  $get: jest.fn(),
  $post: jest.fn(),
  $request: jest.fn()
}

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('lighthouse sentinel batch', () => {
  let wrapper

  it('is a Vue instance', () => {
    wrapper = mount(LighthouseSentinelBatch, { localVue })
    expect(wrapper.findComponent(LighthouseSentinelBatch).exists()).toBeTruthy()
  })

  it('has a barcode', () => {
    wrapper = mount(LighthouseSentinelBatch, {
      localVue,
      data() {
        return {
          boxBarcode: 'lw-ogilvie-4',
        }
      }
    })
    expect(wrapper.vm.boxBarcode).toEqual('lw-ogilvie-4')
  })

  // describe('#getLabwareBarcodes', () => {

  //   let labwareBarcodes, lighthouseSentinelBatch

  //   beforeEach(() => {
  //     wrapper = mount(LighthouseSentinelBatch, { localVue, mocks: { $axios } })
  //     lighthouseSentinelBatch = wrapper.vm
  //   })

  //   it('when the request is successful', async () => {
  //     $axios.$request.mockResolvedValue({ data: LabwaresJson })
  //     labwareBarcodes = await wrapper.vm.getLabwareBarcodes()
  //     expect(labwareBarcodes).toEqual(['lw-aa216-5','lw-aa216-6','lw-aa216-7','lw-aa216-8','lw-aa216-9','lw-aa216-10'])
  //   })

  //   it('when the request fails', async () => {
  //     $axios.$request.mockImplementationOnce(() =>
  //       Promise.reject(new Error('There was an error'))
  //     )
  //     labwareBarcodes = await wrapper.vm.getLabwareBarcodes()
  //     expect(labwareBarcodes).toEqual([])
  //   })

  //   it('when there is no barcode')

  //   it('when the location does not exist')

  //   it('when the location has no labwares')

  // })
})