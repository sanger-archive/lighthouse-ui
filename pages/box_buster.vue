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
      :items="plates"
      :tbody-tr-class="rowClass"
      show-empty
      :empty-text="emptyText"
      sort-by="positiveCount"
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
const countWithMap = (accumulator, { plateMap }) =>
  accumulator + (plateMap ? 1 : 0)
const countWithoutMap = (accumulator, { plateMap }) =>
  accumulator + (plateMap ? 0 : 1)
const sumPositives = (accumulator, { positiveCount }) =>
  accumulator + positiveCount
const mapFormatter = (value) => (value ? 'Yes' : 'No')
const countFormatter = (value, _key, item) => (item.plateMap ? value : 'N/A')

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
          key: 'plateMap',
          sortable: true,
          sortDirection: 'desc',
          formatter: mapFormatter
        },
        {
          key: 'positiveCount',
          sortable: true,
          sortDirection: 'desc',
          formatter: countFormatter
        }
      ],
      emptyText: 'No plates'
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
      if (this.labwhereResponse.error) {
        return (
          this.labwhereResponse.error.message ||
          this.labwhereResponse.error ||
          'Unidentified Error'
        )
      } else {
        return defaultResponse.error
      }
    }
  },
  created() {},
  methods: {
    rowClass(item, type) {
      if (item && type === 'row') {
        return item.plateMap ? 'table-success' : 'table-danger'
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
        this.findPlates({ plateBarcodes: [this.barcode] })
      }
    },
    reset() {
      this.labwhereResponse = defaultResponse
      this.plates = []
    },
    async findPlates(labwhereResponse) {
      const response = await lighthouse.findPlatesFromBarcodes(labwhereResponse)
      if (response.success) {
        console.log('Lighthouse response:', response)
        this.plates = response.plates || []
      } else {
        console.error('Failed Response:', response)
        this.emptyText = response.error.message || response.error
      }
    }
  }
}
</script>
