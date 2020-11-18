<template>
  <b-container>
    <h1>Box Buster</h1>
    <p class="lead">
      Quickly overview box contents to assist with cherrypicking
    </p>
    <b-form-group
      id="box-barcode"
      description="Scan in a lighthouse box barcode to show information about all plates contained in the box."
      label="Please scan lighthouse box barcode"
      label-for="box-barcode-field"
      :invalid-feedback="labwhereFeedback"
      valid-feedback="Box found"
      :state="labwhereState"
    >
      <b-form-input
        id="box-barcode-field"
        v-model="barcode"
        type="search"
        trim
        :state="labwhereState"
        @change="findBox"
      >
      </b-form-input>
    </b-form-group>
    <b-table
      v-if="showTable"
      :items="plates"
      :tbody-tr-class="rowClass"
      show-empty
      :empty-text="lighthouseFeedback"
      sort-by="number_of_positives"
      :sort-desc="true"
      :fields="fields"
    >
      <template #table-caption>
        <span>Box Summary:</span>
        <span>Total of {{ total }} plates in box;</span>
        <span>{{ total_with_maps }} plates with plates maps,</span>
        <span>{{ total_without_maps }} without.</span>
        <span>Total {{ total_positives }} positives.</span>
      </template>
    </b-table>
  </b-container>
</template>

<script>
import lighthouse from '../modules/lighthouse_service'
import { getPlatesFromBoxBarcodes } from '@/modules/labwhere'

// import lighthouse from '../modules/lighthouse_service'
const countWithMap = (accumulator, plate) =>
  accumulator + (plate.plate_map ? 1 : 0)
const countWithoutMap = (accumulator, plate) =>
  accumulator + (plate.plate_map ? 0 : 1)
const sumPositives = (accumulator, plate) =>
  accumulator + plate.number_of_positives
const mapFormatter = (value) => (value ? 'Yes' : 'No')
const countFormatter = (value, _key, item) => (item.plate_map ? value : 'N/A')
const extractError = (response) => {
  if (response.error) {
    return response.error.message || response.error || 'Unidentified Error'
  } else {
    // In practice the user should never see this. However, if they do, it
    // probably means something unexpected happened, so we'll make sure
    // we don't just fail silently.
    return defaultResponse.error
  }
}

const defaultResponse = {
  success: null,
  error: 'No error: This should not be visible'
}

export default {
  data() {
    return {
      barcode: '',
      plates: [],
      labwhereResponse: defaultResponse,
      lighthouseResponse: defaultResponse,
      fields: [
        { key: 'plate_barcode', sortable: true },
        {
          key: 'plate_map',
          sortable: true,
          sortDirection: 'desc',
          formatter: mapFormatter
        },
        {
          key: 'number_of_positives',
          sortable: true,
          sortDirection: 'desc',
          formatter: countFormatter
        }
      ]
    }
  },
  computed: {
    total() {
      return this.plates.length
    },
    total_positives() {
      return this.plates.reduce(sumPositives, 0)
    },
    total_with_maps() {
      return this.plates.reduce(countWithMap, 0)
    },
    total_without_maps() {
      return this.plates.reduce(countWithoutMap, 0)
    },
    labwhereState() {
      return this.labwhereResponse.success
    },
    labwhereFeedback() {
      const error = extractError(this.labwhereResponse)
      return `${error}. Looking up barcode as plate.`
    },
    showTable() {
      // We show the table if we've made a labwhere request, or have
      // populates the plates via some other means.
      return this.labwhereState !== null || this.plates.length !== 0
    },
    lighthouseFeedback() {
      if (this.lighthouseResponse.success === null) {
        return 'Waiting for response from lighthouse...'
      } else {
        return extractError(this.lighthouseResponse)
      }
    }
  },
  created() {},
  methods: {
    rowClass(item, type) {
      if (item && type === 'row') {
        return item.plate_map ? 'table-success' : 'table-danger'
      } else {
        // Hit with, for example, row empty
        return 'table-warning'
      }
    },
    async findBox() {
      this.reset()
      if (this.barcode === '') return

      const response = await getPlatesFromBoxBarcodes(this.barcode)
      this.labwhereResponse = response
      if (response.success) {
        this.findPlates(response)
      } else {
        // If it isn't a box, perhaps its a plate.
        // Requirements were that we should allow plate lookups
        this.findPlates({ barcodes: [this.barcode] })
      }
    },
    reset() {
      this.labwhereResponse = defaultResponse
      this.lighthouseResponse = defaultResponse
      this.plates = []
    },
    async findPlates(labwhereResponse) {
      const response = await lighthouse.findPlatesFromBarcodes(labwhereResponse)
      this.lighthouseResponse = response
      if (response.success) {
        this.plates = response.plates || []
      }
    }
  }
}
</script>
