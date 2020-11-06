import BootstrapVue from 'bootstrap-vue'
import { mount, createLocalVue } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import ReportsJson from '../data/reports'
import BoxBuster from '@/pages/box_buster.vue'
import lighthouse from '@/modules/lighthouse_service'

// Mock the whole module. Returning jest.fn() allows you to mock methods here
// jest.mock('@/modules/lighthouse_service', () => jest.fn())
jest.mock('@/modules/lighthouse_service')

const localVue = createLocalVue()

// List of example plates to use in testing.
const examplePlates = [
  { barcode: 'AP-rna-00149265', plateMap: true, positiveCount: 8 },
  { barcode: 'AP-rna-00149259', plateMap: true, positiveCount: 2 },
  { barcode: 'AP-rna-00151108', plateMap: false, positiveCount: 0 },
  { barcode: 'AP-rna-00151701', plateMap: true, positiveCount: 5 }
]

localVue.use(BootstrapVue)

describe('BoxBuster', () => {
  let wrapper

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('is a Vue instance', () => {
    wrapper = mount(BoxBuster, { localVue })
    expect(wrapper.findComponent(BoxBuster).exists()).toBeTruthy()
  })

  it('renders a list of plates', () => {
    let propsData = { plates: examplePlates }
    wrapper = mount(BoxBuster, { localVue, propsData })
    expect(wrapper.find('table').text()).toContain('AP-rna-00149265')
    expect(wrapper.find('table').text()).toContain('AP-rna-00151701')
    expect(wrapper.find('table').text()).toContain('AP-rna-00149259')
    expect(wrapper.find('table').text()).toContain('AP-rna-00151108')
  })
})
