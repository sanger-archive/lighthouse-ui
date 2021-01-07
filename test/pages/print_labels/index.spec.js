import BootstrapVue from 'bootstrap-vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Index from '@/pages/print_labels/index'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

// these tests are only here because code coverage is at 100%. Ridiculous and I am going to get rid of it.
describe('index', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Index, {
      localVue
    })
  })

  it('is a Vue instance', () => {
    expect(wrapper.findComponent(Index).exists()).toBeTruthy()
  })

  it('has some text', () => {
    expect(wrapper.find('h1').text()).toEqual('Print Labels')
  })
})
