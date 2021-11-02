import cherrytrack from '@/modules/cherrytrack'
import PlateState from '@/pages/plate_state.vue'
import '@/plugins/vue-pluralize'
import { sourcePlate, destinationPlate } from '@/test/data/cherrytrack_plates'
import { createLocalVue, mount } from '@vue/test-utils'
import { BootstrapVue } from 'bootstrap-vue'

// Mock the whole module. Returning jest.fn() allows you to mock methods here
// jest.mock('@/modules/labwhere', () => jest.fn())
jest.mock('@/modules/cherrytrack')

describe('PlateState', () => {
  let wrapper
  const localVue = createLocalVue()
  localVue.use(BootstrapVue)
  const PLATE_BARCODE = '12345'

  beforeEach(() => {
    wrapper = mount(PlateState, {
      localVue,
      data() {
        return {
          barcode: PLATE_BARCODE,
        }
      },
    })
  })

  describe('components', () => {
    it('is a Vue instance', () => {
      expect(wrapper.findComponent(PlateState).exists()).toBeTruthy()
    })

    it('has a barcode input field', () => {
      expect(wrapper.find('#plate-barcode-field').exists()).toBeTruthy()
    })

    it('has an alert', () => {
      expect(wrapper.find('#showAlert').exists()).toBeTruthy()
    })

    it('has a plate summary', () => {
      expect(wrapper.find('#plate-summary').exists()).toBeTruthy()
    })

    it('has a plate filter', () => {
      expect(wrapper.find('#plate-filter').exists()).toBeTruthy()
    })

    it('has a plate table', () => {
      expect(wrapper.find('#plate-table').exists()).toBeTruthy()
    })
  })

  describe('Plate summary', () => {
    it('renders a summary of the plate for source plates', async () => {
      await wrapper.setData({ plate: sourcePlate, plateType: 'Source' })

      const caption = wrapper.find('#plate-summary').text()

      expect(caption).toContain('Plate Summary')
      expect(caption).toContain('Total number of picked wells: 2')
      expect(caption).toContain('Total number of unpicked wells: 2')
    })
  })

  describe('Plate filter', () => {
    it('is disabled when plateType is empty', () => {
      expect(wrapper.find('#plate-filter').element.disabled).toBe(true)
    })

    it('is enable when there is a plateType', async () => {
      await wrapper.setData({ plate: sourcePlate, plateType: 'Source' })

      expect(wrapper.find('#plate-filter').element.disabled).toBe(false)
    })
  })

  describe('Plate table', () => {
    it('renders a table with 8 rows and 12 columns', async () => {
      const table = wrapper.find('#plate-table')

      expect(table.findAll('tr').length).toEqual(9)
      // 9 because we include the column header row
      expect(table.find('tr').findAll('th').length).toEqual(13)
      // 13 because we include the row header column
    })
  })

  describe('computed', () => {
    it('has calculateSourceWells method which returns pickedWells, unpickedWells and emptyWells', async () => {
      await wrapper.setData({ plate: sourcePlate })

      expect(wrapper.vm.calculateSourceWells).toEqual([2, 2, 92])
    })

    it('has plateItems method which calculates the value of each cell', async () => {
      // test with one or two samples in a plate and make sure the output is expected
    })
  })

  describe('methods', () => {
    describe('findPlate', () => {
      it('calls getSourcePlate', async () => {
        cherrytrack.getSourcePlate.mockReturnValue({ success: true, ...sourcePlate })

        await wrapper.setData({ barcode: sourcePlate.barcode })
        await wrapper.vm.findPlate()

        expect(cherrytrack.getSourcePlate).toHaveBeenCalled()
        expect(wrapper.vm.plate).toEqual({ success: true, ...sourcePlate })
        expect(wrapper.vm.plateType).toEqual('Source')
      })

      it('calls getDestinationPlate when getSourcePlate fails', async () => {
        const errorResponse = {
          success: false,
          error: 'Could not find plate',
        }
        cherrytrack.getSourcePlate.mockReturnValue(errorResponse)
        cherrytrack.getDestinationPlate.mockReturnValue({ success: true, ...destinationPlate })

        await wrapper.setData({ barcode: destinationPlate.barcode })
        await wrapper.vm.findPlate()

        expect(cherrytrack.getDestinationPlate).toHaveBeenCalled()
        expect(wrapper.vm.plate).toEqual({ success: true, ...destinationPlate })
        expect(wrapper.vm.plateType).toEqual('Destination')
      })

      it('shows an alert when both requests fail', async () => {
        wrapper.vm.alert = jest.fn()
        const errorResponse = {
          success: false,
          error: 'Could not find plate',
        }
        cherrytrack.getSourcePlate.mockReturnValue(errorResponse)
        cherrytrack.getDestinationPlate.mockReturnValue(errorResponse)

        await wrapper.setData({ barcode: 'Random barcode' })
        await wrapper.vm.findPlate()

        expect(wrapper.find('#showAlert').text()).toContain('Could not find plate')
      })
    })
  })
})
