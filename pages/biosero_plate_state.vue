<template>
  <b-container style="max-width: 1400px">
    <h1 class="mt-3">Biosero Plate state</h1>
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

    <p>
      <b-alert 
        id="alert"
        :show="alertData.show"
        dismissible
        fade
        :variant="alertData.variant"
        @dismissed="alertData.show=false"
      >
        {{ alertData.message }}
      </b-alert>
    </p>

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
import lighthouseBiosero from '@/modules/lighthouse_service_biosero'

export default {
  name: 'BioseroPlateState',
  data() {
    return {
      barcode: '',
      lastPlateBarcode: '',
      plate: { source: false, destination: false },
      filter: 'source_barcode',
      alertData: { variant: '', message: '', show: false },
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
      const filters = [
        { text: 'Source Barcode', value: 'source_barcode' },
        { text: 'Source Coordinate', value: 'source_coordinate' },
        { text: 'RNA ID', value: 'rna_id' },
        { text: 'Run ID', value: 'automation_system_run_id' },
        { text: 'Lab ID', value: 'lab_id' },
        { text: 'Date picked', value: 'date_picked' },
        { text: 'Destination Coordinate', value: 'destination_coordinate' },
      ]
      if (this.plate.source) {
        filters.push({ text: 'Destination Barcode', value: 'destination_barcode' })
      } else if (this.plate.destination) {
        filters.push(
          { text: 'Control Barcode', value: 'control_barcode' },
          { text: 'Control Type', value: 'control' }
        )
      }
      return filters
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
      let pickedWells = 0
      let controlWells = 0
      let emptyWells = 0
      this.plate.wells.forEach((well) => {
        switch (well.type) {
          case "control":
            controlWells += 1
            break;
          case "sample":
            pickedWells += 1
            break;
          case "empty":
            emptyWells += 1
            break;
        }
      })

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
      this.filter = 'source_barcode' // Resets the filter each plate to prevent empty filter bug
      this.alertData = { variant: '', message: '', show: false } // Removes existing alerts when a new plate is scanned
      let plate = await lighthouseBiosero.getBioseroPlate(this.barcode, 'source')
      if (plate.success) {
        this.plate = plate
      } else {
        plate = await lighthouseBiosero.getBioseroPlate(this.barcode, 'destination')
        if (plate.success) {
          this.plate = plate
        } else {
          this.plate = { source: false, destination: false }
          this.showAlert(`Could not find a plate used on a Biosero system with barcode: ${this.barcode}`, 'danger')
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
            if (well.type === 'sample') {
              row._cellVariants[field] = 'success'
            } else if (well.type === 'control') {
              row._cellVariants[field] = 'secondary'
            }
          }
        })
        return row
      })
    },
    showAlert(message, variant) {
      this.alertData.show = true
      this.alertData.variant = variant
      this.alertData.message = message
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
