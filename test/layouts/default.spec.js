import BootstrapVue from 'bootstrap-vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Default from '@/layouts/default.vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('Index', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Default, {
      localVue,
      stubs: {
        nuxt: true
      }
    })
  })

  it('is a Vue instance', () => {
    expect(wrapper.findComponent(Default).exists()).toBeTruthy()
  })

  it('has a navbar', () => {
    expect(wrapper.findComponent({ ref: 'navbar' }).text()).toMatch(
      /Lighthouse {2}Reports Sentinel Sample Creation Sentinel Cherrypick Imports/
    )
  })
})
