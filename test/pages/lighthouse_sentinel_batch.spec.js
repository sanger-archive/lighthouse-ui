import BootstrapVue from 'bootstrap-vue'
import { mount, createLocalVue } from '@vue/test-utils'
import LighthouseSentinelBatch from '@/pages/lighthouse_sentinel_batch'

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
          boxBarcode: 'lw-ogilvie-4'
        }
      }
    })
    expect(wrapper.vm.boxBarcode).toEqual('lw-ogilvie-4')
  })
})
