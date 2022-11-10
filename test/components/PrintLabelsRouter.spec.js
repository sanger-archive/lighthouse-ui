import { createLocalVue, mount } from '@vue/test-utils'
import { BootstrapVue } from 'bootstrap-vue'
import PrintLabelsRouter from '@/components/PrintLabelsRouter'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

const links = [
  'Print Destination plate Labels',
  'Print Source plate labels',
  'Print Control plate labels',
  'Print Ad Hoc plate labels',
]

describe('PrintLabelsRouter.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(PrintLabelsRouter, {
      localVue,
      stubs: ['nuxt-link'],
    })
  })

  it('is a Vue instance', () => {
    expect(wrapper.findComponent(PrintLabelsRouter).exists()).toBeTruthy()
  })

  it.each(links)('will have a link to %s', (link) => {
    expect(wrapper.text()).toMatch(link)
  })
})
