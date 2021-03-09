 <template>
  <b-container>
    <h1 class="mt-3">Box Buster</h1>
    <p class="lead">Quickly overview box contents to assist with cherrypicking</p>
    <b-form-group
      id="box-barcode"
      description="Scan in a lighthouse box barcode to show information about all plates contained in the box."
      label="Box barcode:"
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
        @change="refreshResults"
      >
      </b-form-input>
    </b-form-group>
    <p>
      <b-button id="refreshResults" variant="info" :disabled="isBusy" @click="refreshResults"
        >Refresh</b-button
      >
    </p>
    <p>
      <b-alert id="alert" :show="isError" dismissible variant="danger">
        {{ `Error in lighthouse service: ${lighthouseFeedback}` }}
      </b-alert>
    </p>
    <b-table
      ref="plates_table"
      :items="plates"
      :tbody-tr-class="rowClass"
      :fields="fields"
      caption-top
      :busy.sync="isBusy"
      show-empty
    >
      <template #table-caption>
        <strong>Box Summary:</strong>
        <b-row>
          <b-col>
            <ul>
              <li>Total of {{ total }} {{ 'plate' | pluralize(total) }} in the box</li>
              <li>
                {{ total_with_maps }} {{ 'plate' | pluralize(total_with_maps) }} with plate
                {{ 'map' | pluralize(total_with_maps) }}
              </li>
              <li>
                {{ total_without_maps }} {{ 'plate' | pluralize(total_without_maps) }} without plate
                {{ 'map' | pluralize(total_without_maps) }}
              </li>
              <span>Box barcodes scanned:</span>
              <span v-for="scanned_barcode in barcodes_scanned" :key="scanned_barcode">
                <span :class="isBarcodeDuplicate(scanned_barcode)"> {{ scanned_barcode }}, </span>
              </span>
            </ul>
          </b-col>
          <b-col>
            <ul>
              <li>
                Total of {{ total_fit_to_pick }} fit to pick
                {{ 'sample' | pluralize(total_fit_to_pick) }}
              </li>
              <li style="color: green">
                {{ total_must_sequence }} {{ 'plate' | pluralize(total_must_sequence) }} with
                samples that must be sequenced
              </li>
              <li style="color: DarkOrange">
                {{ total_preferentially_sequence }}
                {{ 'plate' | pluralize(total_preferentially_sequence) }} with samples that should
                preferentially be sequenced
              </li>
            </ul>
          </b-col>
        </b-row>
        <small>
          <span>Sorted by: 1. Must Sequence 2. Preferentially Sequence 3. Fit to Pick Samples</span>
        </small>
      </template>
      <template #table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>{{ currentState }}</strong>
        </div>
      </template>
    </b-table>
  </b-container>
</template>

<script>
import labwhere from '@/modules/labwhere'
import lighthouse from '@/modules/lighthouse_service'
import statuses from '@/modules/statuses'

const countByMustSequence = (accumulator, plate) =>
  accumulator + (plate.count_must_sequence > 0 ? 1 : 0)

const countByPreferentiallySequence = (accumulator, plate) =>
  accumulator + (plate.count_preferentially_sequence > 0 ? 1 : 0)

const countWithMap = (accumulator, plate) => accumulator + (plate.has_plate_map ? 1 : 0)

const countWithoutMap = (accumulator, plate) => accumulator + (plate.has_plate_map ? 0 : 1)

const sumPositives = (accumulator, plate) =>
  accumulator + (plate.count_fit_to_pick_samples == null ? 0 : plate.count_fit_to_pick_samples)

const booleanFormatter = (value) => (value ? 'Yes' : 'No')

const countFormatter = (value, _key, item) => (item.has_plate_map ? value : 'N/A')

const booleanWithCountFormatter = (value) => (value == null ? 'No' : `Yes (${value})`)

const extractError = (response) => {
  if (response.error) {
    return response.error.message || response.error || 'Unidentified Error'
  } else {
    // In practice the user should never see this. However, if they do, it probably means something
    // unexpected happened, so we'll make sure we don't just fail silently.
    return defaultResponse.error
  }
}

/**
 * Sorting plates by must_sequence, then preferentially_sequence, then count_fit_to_pick_samples
 */
const sortCompare = (aPlate, bPlate) => {
  if (bPlate.count_must_sequence > aPlate.count_must_sequence) return 1
  if (bPlate.count_must_sequence < aPlate.count_must_sequence) return -1

  if (bPlate.count_preferentially_sequence > aPlate.count_preferentially_sequence) return 1
  if (bPlate.count_preferentially_sequence < aPlate.count_preferentially_sequence) return -1

  if (bPlate.count_filtered_positive > aPlate.count_filtered_positive) return 1
  if (bPlate.count_filtered_positive < aPlate.count_filtered_positive) return -1

  return 0
}

const defaultResponse = {
  success: null,
  error: 'No error: This should not be visible',
}

export default {
  data() {
    return {
      barcode: '',
      currentState: '',
      plates: [],
      barcodes_scanned: [],
      labwhereResponse: defaultResponse,
      lighthouseResponse: defaultResponse,
      isBusy: false,
      status: '',
      fields: [
        {
          key: 'plate_barcode',
          label: 'Plate barcode',
        },
        {
          key: 'has_plate_map',
          label: 'Plate map',
          formatter: booleanFormatter,
        },
        {
          key: 'count_fit_to_pick_samples',
          label: 'Fit to pick samples',
          formatter: countFormatter,
        },
        {
          key: 'count_must_sequence',
          label: 'Must sequence',
          formatter: booleanWithCountFormatter,
        },
        {
          key: 'count_preferentially_sequence',
          label: 'Preferentially sequence',
          formatter: booleanWithCountFormatter,
        },
        {
          key: 'count_filtered_positive',
          label: 'Filtered positive',
          formatter: countFormatter,
        },
      ],
    }
  },
  computed: {
    total() {
      return this.plates.length
    },
    total_fit_to_pick() {
      return this.plates.reduce(sumPositives, 0)
    },
    total_with_maps() {
      return this.plates.reduce(countWithMap, 0)
    },
    total_without_maps() {
      return this.plates.reduce(countWithoutMap, 0)
    },
    total_must_sequence() {
      return this.plates.reduce(countByMustSequence, 0)
    },
    total_preferentially_sequence() {
      return this.plates.reduce(countByPreferentiallySequence, 0)
    },
    labwhereState() {
      return this.labwhereResponse.success
    },
    labwhereFeedback() {
      const error = extractError(this.labwhereResponse)
      return `${error}. Looking up barcode as plate.`
    },
    lighthouseFeedback() {
      if (this.lighthouseResponse.success === null) {
        return 'Waiting for response from the lighthouse service...'
      } else {
        return extractError(this.lighthouseResponse)
      }
    },
    isError() {
      return this.status === statuses.Error
    },
  },
  created() {},
  methods: {
    isBarcodeDuplicate(barcode) {
      if (this.barcodes_scanned.indexOf(barcode) !== this.barcodes_scanned.lastIndexOf(barcode)) {
        return { 'text-danger': true }
      }
      return { 'text-danger': false }
    },
    rowClass(item, type) {
      if (item && type === 'row') {
        return item.has_plate_map ? 'table-success' : 'table-danger'
      }
    },
    async platesProvider(ctx) {
      this.currentState = 'Checking barcode in Labwhere...'
      this.isBusy = true
      try {
        this.reset()
        if (this.barcode === '') {
          this.isBusy = false
          return []
        }

        const plates = await this.findPlates()

        this.isBusy = false
        return this.sortedPlates(plates)
      } catch (error) {
        this.isBusy = false
        this.status = statuses.Error

        return []
      }
    },
    reset() {
      this.labwhereResponse = defaultResponse
      this.lighthouseResponse = defaultResponse
    },
    async findPlatesInLighthouse(labwhereResponse) {
      this.currentState = `Checking ${this.$pluralize(
        'plate',
        labwhereResponse.length
      )} in the Lighthouse service`

      const response = await lighthouse.findPlatesFromBarcodes(labwhereResponse)

      this.lighthouseResponse = response

      if (response.success) {
        return this.sortedPlates(response.plates)
      } else {
        throw response.errors
      }
    },
    async findPlates() {
      const response = await labwhere.getPlatesFromBoxBarcodes(this.barcode)
      this.labwhereResponse = response
      let plates = []
      if (response.success) {
        plates = this.findPlatesInLighthouse(response)
      } else {
        // If it isn't a box, perhaps its a plate.
        // Requirements were that we should allow plate lookups
        plates = this.findPlatesInLighthouse({ barcodes: [this.barcode] })
      }
      this.barcodes_scanned.push(this.barcode)
      this.barcode = ''
      return plates
    },
    sortedPlates(plates) {
      if (plates.length === 0) {
        return []
      }
      return plates.sort(sortCompare)
    },
    refreshResults() {
      this.provider()
      if (this.$refs.plates_table) {
        this.$refs.plates_table.refresh()
      }
    },
    async provider() {
      this.plates = await this.platesProvider()
    },
  },
}
</script>
