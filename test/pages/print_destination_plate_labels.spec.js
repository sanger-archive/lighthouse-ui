import BootstrapVue from 'bootstrap-vue'
import { mount, createLocalVue } from '@vue/test-utils'
import PrintDestinationPlateLabels from '@/pages/print_destination_plate_labels'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('print destination plate labels', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(PrintDestinationPlateLabels, {
      localVue,
      data() {
        return {}
      }
    })
  })

  it('is a Vue instance', () => {
    expect(
      wrapper.findComponent(PrintDestinationPlateLabels).exists()
    ).toBeTruthy()
  })
})
