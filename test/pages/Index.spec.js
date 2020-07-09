import { shallowMount } from '@vue/test-utils'
import Index from '@/pages/index.vue'

describe('Index', () => {

  // TODO: change to mount. Add stubs. Fix deprecation warnings.
  test('is a Vue instance', () => {
    const wrapper = shallowMount(Index)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
