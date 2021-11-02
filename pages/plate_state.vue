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

    <b-card id="plate-summary" title="Plate Summary" :sub-title="plateType">
      <div v-if="plateType === 'Source'">
        <b-card-text style="color: green"
          >Total number of picked wells: {{ calculateSourceWells[0] }}</b-card-text
        >
        <b-card-text style="color: darkorange"
          >Total number of unpicked wells: {{ calculateSourceWells[1] }}</b-card-text
        >
        <b-card-text>Total number of empty wells: {{ calculateSourceWells[2] }}</b-card-text>
      </div>
      <b-form-group id="plate-filter-group" label="Filters:" label-for="plateFilter">
        <b-form-select
          id="plate-filter"
          v-model="filter"
          style="width: 250px"
          :options="plateFilterOptions"
          :disabled="!plateType.length"
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
import cherrytrack from '@/modules/cherrytrack'

export default {
  name: 'PlateState',
  components: {
    Alert,
  },
  data() {
    return {
      barcode: '',
      plate: {},
      plateType: '',
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
      plateFilterOptions: [
        { text: 'Source Barcode', value: 'source_barcode' },
        { text: 'Control Barcode', value: 'control_barcode' },
        { text: 'Source Coordinate', value: 'source_coordinate' },
        { text: 'Destination Coordinate', value: 'destination_coordinate' },
        { text: 'RNA ID', value: 'rna_id' },
        { text: 'Run ID', value: 'automation_system_run_id' },
        { text: 'Date picked', value: 'date_picked' },
        { text: 'Date created', value: 'created_at' },
      ],
    }
  },
  computed: {
    calculateSourceWells() {
      let pickedWells, unpickedWells, emptyWells
      if (this.plate.samples !== undefined) {
        pickedWells = this.plate.samples.filter((sample) => {
          return sample.picked
        }).length
        unpickedWells = this.plate.samples.length - pickedWells
        emptyWells = 96 - this.plate.samples.length
      }
      return [pickedWells, unpickedWells, emptyWells]
    },
    plateItems() {
      const rows = this.rowHeaders.map((header) => {
        const row = { row: header, _cellVariants: {} }
        if (this.plateType === 'Source') {
          this.plateFields.forEach((field) => {
            const well = this.plate.samples.find(
              (well) => well.source_coordinate === `${header}${field}`
            )
            if (well) {
              row[field] = well[this.filter]
              row._cellVariants[field] = well.picked ? 'success' : 'warning'
            }
          })
        }
        if (this.plateType === 'Destination') {
          this.plateFields.forEach((field) => {
            const well = this.plate.wells.find(
              (well) => well.destination_coordinate === `${header}${field}`
            )
            if (well) {
              row[field] = well[this.filter]
            }
          })
        }
        return row
      })
      return rows
    },
  },
  methods: {
    async findPlate() {
      let plate = await cherrytrack.getSourcePlate(this.barcode)
      if (plate.success) {
        this.plateType = 'Source'
        this.plate = plate
      } else {
        plate = await cherrytrack.getDestinationPlate(this.barcode)
        if (plate.success) {
          this.plateType = 'Destination'
          this.plate = plate
        } else {
          this.$refs.alert.show('Could not find plate in Bioseros', 'danger')
        }
      }
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
