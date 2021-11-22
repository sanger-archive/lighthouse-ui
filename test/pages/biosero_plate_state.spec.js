import { createLocalVue, mount } from '@vue/test-utils'
import { BootstrapVue } from 'bootstrap-vue'
import lighthouseBiosero from '@/modules/lighthouse_service_biosero'
import BioseroPlateState from '@/pages/biosero_plate_state.vue'
import '@/plugins/vue-pluralize'
import { sourcePlate, destinationPlate } from '@/test/data/biosero_plates'

jest.mock('@/modules/lighthouse_service_biosero')

describe('BioseroPlateState', () => {
  let wrapper
  const localVue = createLocalVue()
  localVue.use(BootstrapVue)
  const PLATE_BARCODE = '12345'

  beforeEach(() => {
    wrapper = mount(BioseroPlateState, {
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
      expect(wrapper.findComponent(BioseroPlateState).exists()).toBeTruthy()
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
      await wrapper.setData({ plate: { ...sourcePlate, source: true }})
      await wrapper.setData({ lastPlateBarcode: 'source-barcode' })

      const caption = wrapper.find('#plate-summary').text()

      expect(caption).toContain('Plate Summary')
      expect(caption).toContain('Source plate barcode: source-barcode')
      expect(caption).toContain('Total number of picked wells: 2')
      expect(caption).toContain('Total number of unpicked wells: 2')
      expect(caption).toContain('Total number of empty wells: 92')
    })

    it('renders a summary of the plate for destination plates', async () => {
      await wrapper.setData({ plate: { ...destinationPlate, destination: true }})
      await wrapper.setData({ lastPlateBarcode: 'destination-barcode' })

      const caption = wrapper.find('#plate-summary').text()

      expect(caption).toContain('Plate Summary')
      expect(caption).toContain('Destination plate barcode: destination-barcode')
      expect(caption).toContain('Total number of picked wells: 4')
      expect(caption).toContain('Total number of control wells: 1')
      expect(caption).toContain('Total number of empty wells: 0')
    })
  })

  describe('Plate filter', () => {
    it('is disabled when plate.source and plate.destination are false', () => {
      expect(wrapper.find('#plate-filter').element.disabled).toBe(true)
    })

    it('is enabled when plate.source is true', async () => {
      await wrapper.setData({ plate: { ...sourcePlate, source: true }})

      expect(wrapper.find('#plate-filter').element.disabled).toBe(false)
    })

    it('is enabled when plate.destination is true', async () => {
      await wrapper.setData({ plate: { ...destinationPlate, destination: true }})

      expect(wrapper.find('#plate-filter').element.disabled).toBe(false)
    })
  })

  describe('Plate table', () => {
    it('renders a table with 8 rows and 12 columns', () => {
      const table = wrapper.find('#plate-table')

      expect(table.findAll('tr')).toHaveLength(9)
      // 9 because we include the column header row
      expect(table.find('tr').findAll('th')).toHaveLength(13)
      // 13 because we include the row header column
    })
  })

  describe('computed', () => {
    it('has calculateSourceWells method which returns pickedWells, unpickedWells and emptyWells', async () => {
      await wrapper.setData({ plate: sourcePlate })

      expect(wrapper.vm.calculateSourceWells).toEqual([2, 2, 92])
    })

    it('has calculateDestinationWells method which returns pickedWells, controlWells and emptyWells', async () => {
      await wrapper.setData({ plate: destinationPlate })

      expect(wrapper.vm.calculateDestinationWells).toEqual([4, 1, 0])
    })

    describe('plateFilterOptions', () => {
      it('returns the correct filter options for a source plate', async () => {
        await wrapper.setData({ plate: { ...sourcePlate, source: true }})

        expect(wrapper.vm.plateFilterOptions).toEqual([
          { text: 'Source Barcode', value: 'source_barcode' },
          { text: 'Control Barcode', value: 'control_barcode', disabled: true },
          { text: 'Control Type', value: 'control', disabled: true },
          { text: 'Source Coordinate', value: 'source_coordinate' },
          { text: 'Destination Coordinate', value: 'destination_coordinate' },
          { text: 'RNA ID', value: 'rna_id' },
          { text: 'Run ID', value: 'automation_system_run_id' },
          { text: 'Lab ID', value: 'lab_id' },
          { text: 'LH sample UUID', value: 'lh_sample_uuid' },
          { text: 'Date picked', value: 'date_picked' },
          { text: 'Date created', value: 'created_at' }
        ])
      })

      it('returns the correct filter options for a destination plate', async () => {
        await wrapper.setData({ plate: { ...destinationPlate, destination: true }})

        expect(wrapper.vm.plateFilterOptions).toEqual([
          { text: 'Source Barcode', value: 'source_barcode' },
          { text: 'Control Barcode', value: 'control_barcode', disabled: false },
          { text: 'Control Type', value: 'control', disabled: false },
          { text: 'Source Coordinate', value: 'source_coordinate' },
          { text: 'Destination Coordinate', value: 'destination_coordinate' },
          { text: 'RNA ID', value: 'rna_id' },
          { text: 'Run ID', value: 'automation_system_run_id' },
          { text: 'Lab ID', value: 'lab_id' },
          { text: 'LH sample UUID', value: 'lh_sample_uuid' },
          { text: 'Date picked', value: 'date_picked' },
          { text: 'Date created', value: 'created_at' }
        ])
      })
    })

    describe('plateItems', () => {
      it('calls sourcePlateItems when the plate is a source plate', async () => {
        wrapper.vm.sourcePlateItems = jest.fn()
        wrapper.vm.sourcePlateItems.mockReturnValue([{"row": "A"}])
        await wrapper.setData({ plate: { ...sourcePlate, source: true }})

        expect(wrapper.vm.plateItems).toEqual([{"row": "A"}])
      })

      it('calls destinationPlateItems when the plate is a destination plate', async () => {
        wrapper.vm.destinationPlateItems = jest.fn()
        wrapper.vm.destinationPlateItems.mockReturnValue([{"row": "B"}])
        await wrapper.setData({ plate: { ...destinationPlate, destination: true }})

        expect(wrapper.vm.plateItems).toEqual([{"row": "B"}])
      })

      it('returns empty item structure when no plate is set', () => {
        expect(wrapper.vm.plateItems).toEqual([
          {"row": "A"}, {"row": "B"}, {"row": "C"}, {"row": "D"},
          {"row": "E"}, {"row": "F"}, {"row": "G"}, {"row": "H"}
        ])
      })
    })
  })

  describe('methods', () => {
    describe('findPlate', () => {
      it('calls getSourcePlate', async () => {
        lighthouseBiosero.getBioseroPlate.mockReturnValue({ success: true, ...sourcePlate, source: true })

        await wrapper.setData({ barcode: sourcePlate.barcode })
        await wrapper.vm.findPlate()

        expect(lighthouseBiosero.getBioseroPlate).toHaveBeenCalledWith(sourcePlate.barcode, 'source')
        expect(wrapper.vm.plate).toEqual({ success: true, ...sourcePlate, source: true })
      })

      it('calls getBioseroPlate with type destination when type source fails', async () => {
        const errorResponse = {
          success: false,
          error: 'Could not find plate',
        }
        // getBioseroPlate gets called once for source plate, which we want to fail, and then called with destination plate
        lighthouseBiosero.getBioseroPlate.mockReturnValueOnce(errorResponse).mockReturnValue({ success: true, ...destinationPlate, destination: true })

        await wrapper.setData({ barcode: destinationPlate.barcode })
        await wrapper.vm.findPlate()

        expect(lighthouseBiosero.getBioseroPlate).toHaveBeenCalledWith(destinationPlate.barcode, 'source')
        expect(lighthouseBiosero.getBioseroPlate).toHaveBeenCalledWith(destinationPlate.barcode, 'destination')
        expect(wrapper.vm.plate).toEqual({ success: true, ...destinationPlate, destination: true })
      })

      it('shows an alert and clears the plate object when both requests fail', async () => {
        wrapper.vm.alert = jest.fn()
        const errorResponse = {
          success: false,
          error: 'Could not find plate',
        }
        lighthouseBiosero.getBioseroPlate.mockReturnValue(errorResponse)

        await wrapper.setData({ barcode: 'Random barcode' })
        await wrapper.vm.findPlate()

        expect(wrapper.find('#showAlert').text()).toContain('Could not find a plate used on a Biosero system with barcode: Random barcode')
        expect(wrapper.vm.plate).toEqual({ source: false, destination: false })
      })

      it('sets barcode values', async () => {
        await wrapper.vm.findPlate()

        expect(wrapper.vm.lastPlateBarcode).toEqual(PLATE_BARCODE)
        expect(wrapper.vm.barcode).toBe("")
      })
    })

    describe('sourcePlateItems', () => {
      it('applies the correct filter for each position', async () => {
        await wrapper.setData({ filter: 'source_barcode' })
        await wrapper.setData({ plate: { ...sourcePlate, source: true }})

        const sourcePlateItems = wrapper.vm.sourcePlateItems()

        expect(sourcePlateItems[0]).toEqual(
          { 
            "2": sourcePlate.samples[0].source_barcode,
            "4": sourcePlate.samples[1].source_barcode,
            "6": sourcePlate.samples[2].source_barcode,
            "8": sourcePlate.samples[3].source_barcode,
            "_cellVariants": {
              "2": "success",
              "4": "success",
              "6": "warning",
              "8": "warning",
            },
            "row": "A",
          }
        )
      })
    })

    describe('destinationPlateItems', () => {
      it('applies the correct filter for each position', async () => {
        await wrapper.setData({ filter: 'rna_id' })
        await wrapper.setData({ plate: { ...destinationPlate, destination: true }})

        const destinationPlateItems = wrapper.vm.destinationPlateItems()

        // For the picked wells
        expect(destinationPlateItems[0]).toEqual(
          { 
            "1": destinationPlate.wells[0].rna_id,
            "2": destinationPlate.wells[1].rna_id,
            "3": destinationPlate.wells[2].rna_id,
            "4": destinationPlate.wells[3].rna_id,
            "_cellVariants": {
              "1": "success",
              "2": "success",
              "3": "success",
              "4": "success",
            },
            "row": "A",
          }
        )
        // For the control well
        expect(destinationPlateItems[3]).toEqual(
          { 
            "2": destinationPlate.wells[4].rna_id,
            "_cellVariants": {
              "2": "secondary",
            },
            "row": "D",
          }
        )
      })
    })
  })
})
