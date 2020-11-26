import BeckmanCherrypick from '@/pages/beckman_cherrypick.vue'
import BootstrapVue from 'bootstrap-vue'
import { mount, createLocalVue } from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('Beckman Cherrypick', () => {
  it('is a Vue instance', () => {
    const wrapper = mount(BeckmanCherrypick, { localVue })
    expect(wrapper.findComponent(BeckmanCherrypick).exists()).toBeTruthy()
  })
})
