import { createLocalVue, mount } from '@vue/test-utils'
import { BootstrapVue } from 'bootstrap-vue'
import UATActionsRouter from '@/components/UATActionsRouter'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

const links = ['Generate Test Run', 'Test Runs']

describe('UATActionsRouter.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(UATActionsRouter, {
      localVue,
    })
  })

  it('is a Vue instance', () => {
    expect(wrapper.findComponent(UATActionsRouter).exists()).toBeTruthy()
  })

  it.each(links)('will have a link to %s', (link) => {
    expect(wrapper.text()).toMatch(link)
  })
})
