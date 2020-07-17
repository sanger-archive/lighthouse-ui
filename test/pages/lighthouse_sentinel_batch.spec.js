import BootstrapVue from 'bootstrap-vue'
import { mount, createLocalVue } from '@vue/test-utils'
import LighthouseSentinelBatch from '@/pages/lighthouse_sentinel_batch'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('lighthouse sentinel batch', () => {
  let wrapper, lighthouseSentinelBatch

  beforeEach(() => {
    wrapper = mount(LighthouseSentinelBatch, {
      localVue,
      data() {
        return {
          boxBarcode: 'lw-ogilvie-4',
          checkBox: ['positive']
        }
      }
    })
    lighthouseSentinelBatch = wrapper.vm
  })

  it('is a Vue instance', () => {
    expect(wrapper.findComponent(LighthouseSentinelBatch).exists()).toBeTruthy()
  })

  it('has a barcode', () => {
    expect(lighthouseSentinelBatch.boxBarcode).toEqual('lw-ogilvie-4')
  })

  it('has a positivesOnly flag', () => {
    expect(lighthouseSentinelBatch.positivesOnly).toBeTruthy()
  })
})
