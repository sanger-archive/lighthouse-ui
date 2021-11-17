<template>
  <b-container style="max-width: 1400px">
    <h1 class="mt-3">Plate state</h1>
    <p class="lead">Find the state of a source or destination plate</p>
    <b-form-group
      id="plate-barcode"
      description="Scan in a destination or source plate barcode to search for its state in Biosero"
      label="Plate barcode:"
      label-for="plate-barcode-field"
    >
      <b-form-input
        id="plate-barcode-field"
        ref="plate-barcode-field"
        v-model="barcode"
        type="search"
        trim
      ></b-form-input>
    </b-form-group>

    <p>
      <b-button id="searchPlates" variant="info" @click="findPlate">Search</b-button>
    </p>

    <Alert ref="alert"></Alert>

    <b-card id="plate-summary" title="Plate Summary">
      <div v-if="plate.source">
        <b-card-text
          ><b>Source plate barcode:</b> {{ lastPlateBarcode }}</b-card-text
        >
        <b-card-text style="color: green"
          >Total number of picked wells: {{ calculateSourceWells[0] }}</b-card-text
        >
        <b-card-text style="color: darkorange"
          >Total number of unpicked wells: {{ calculateSourceWells[1] }}</b-card-text
        >
        <b-card-text>Total number of empty wells: {{ calculateSourceWells[2] }}</b-card-text>
      </div>

      <div v-if="plate.destination">
        <b-card-text
          ><b>Destination plate barcode:</b> {{ lastPlateBarcode }}</b-card-text
        >
        <b-card-text style="color: green"
          >Total number of picked wells: {{ calculateDestinationWells[0] }}</b-card-text
        >
        <b-card-text style="color: gray"
          >Total number of control wells: {{ calculateDestinationWells[1] }}</b-card-text
        >
        <b-card-text>Total number of empty wells: {{ calculateDestinationWells[2] }}</b-card-text>
      </div>

      <b-form-group id="plate-filter-group" label="Filters:" label-for="plateFilter">
        <b-form-select
          id="plate-filter"
          v-model="filter"
          style="width: 250px"
          :options="plateFilterOptions"
          :disabled="!plate.source && !plate.destination"
        />
      </b-form-group>
    </b-card>

    <div id="plate-container">
      <b-table id="plate-table" :fields="plateFields" :items="plateItems" fixed bordered></b-table>
    </div>
  </b-container>
</template>

<script>
import Alert from '@/components/Alert'
import lighthouseBiosero from '@/modules/lighthouse_service_biosero'

export default {
  name: 'PlateState',
  components: {
    Alert,
  },
  data() {
    return {
      barcode: '',
      lastPlateBarcode: '',
      plate: { source: false, destination: false },
      filter: 'source_barcode',
      plateFields: [
        { key: 'row', label: '', isRowHeader: true },
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
      ],
      rowHeaders: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    }
  },
  computed: {
    plateFilterOptions() {
      return [
        { text: 'Source Barcode', value: 'source_barcode' },
        { text: 'Control Barcode', value: 'control_barcode', disabled: !this.plate.destination },
        { text: 'Control Type', value: 'control', disabled: !this.plate.destination },
        { text: 'Source Coordinate', value: 'source_coordinate' },
        { text: 'Destination Coordinate', value: 'destination_coordinate' },
        { text: 'RNA ID', value: 'rna_id' },
        { text: 'Run ID', value: 'automation_system_run_id' },
        { text: 'Lab ID', value: 'lab_id' },
        { text: 'LH sample UUID', value: 'lh_sample_uuid' },
        { text: 'Date picked', value: 'date_picked' },
        { text: 'Date created', value: 'created_at' },
      ]
    },
    calculateSourceWells() {
      const pickedWells = this.plate.samples.filter((sample) => {
        return sample.picked
      }).length
      const unpickedWells = this.plate.samples.length - pickedWells
      const emptyWells = 96 - this.plate.samples.length

      return [pickedWells, unpickedWells, emptyWells]
    },
    calculateDestinationWells() {
      const controlWells = this.plate.wells.filter((well) => {
        return well.type === "control"
      }).length
      const pickedWells = this.plate.wells.length - controlWells
      const emptyWells = 96 - this.plate.wells.length

      return [pickedWells, controlWells, emptyWells]
    },
    plateItems() {
      if (this.plate.source) {
        return this.sourcePlateItems()
      } else if (this.plate.destination) {
        return this.destinationPlateItems()
      } else {
        return this.rowHeaders.map((header) => {
          return { row: header }
        })
      }
    },
  },
  methods: {
    async findPlate() {
      let plate = await lighthouseBiosero.getBioseroPlate(this.barcode, 'source')
      if (plate.success) {
        this.plate = plate
      } else {
        plate = await lighthouseBiosero.getBioseroPlate(this.barcode, 'destination')
        if (plate.success) {
          this.plate = plate
        } else {
          this.plate = { source: false, destination: false }
          this.$refs.alert.show(`Could not find plate in Biosero with barcode: ${this.barcode}`, 'danger')
        }
      }
      this.lastPlateBarcode = this.barcode
      this.barcode = ""
    },
    sourcePlateItems() {
      return this.rowHeaders.map((header) => {
        const row = { row: header, _cellVariants: {} }
        this.plateFields.forEach((field) => {
          const well = this.plate.samples.find(
            (well) => well.source_coordinate === `${header}${field}`
          )
          if (well) {
            row[field] = well[this.filter]
            row._cellVariants[field] = well.picked ? 'success' : 'warning'
          }
        })
        return row
      })
    },
    destinationPlateItems() {
      return this.rowHeaders.map((header) => {
        const row = { row: header, _cellVariants: {} }
        this.plateFields.forEach((field) => {
          const well = this.plate.wells.find(
            (well) => well.destination_coordinate === `${header}${field}`
          )
          if (well) {
            row[field] = well[this.filter]
            row._cellVariants[field] = well.type === 'sample' ? 'success' : 'secondary'
          }
        })
        return row
      })
    },
  },
}
</script>
<style>
#plate-container {
  width: 100%;
  overflow-x: auto;
}
#plate-table {
  min-width: 1200px;
  word-wrap: break-word;
}
</style>
