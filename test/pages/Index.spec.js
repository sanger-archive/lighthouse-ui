import BootstrapVue from 'bootstrap-vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Index from '@/pages/index.vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('Index', () => {

  // TODO: Make this a proper test.
  test('is a Vue instance', () => {
    const wrapper = mount(Index, { localVue } )
    expect(wrapper.findComponent(Index).exists()).toBeTruthy()
  })
})
