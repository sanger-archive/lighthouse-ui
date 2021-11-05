<template>
  <b-container>
    <h1 class="mt-3">Sentinel Sample Creation</h1>
    <p class="lead">Creates samples in Sequencescape from the fit to pick samples</p>
    <Alert ref="alert"></Alert>

    <form class="border">
      <div class="form-group row">
        <label for="box-barcode" class="col-sm-4 col-form-label">
          Please scan Lighthouse box barcode
          <p class="text-danger">
            Box and its contents need to be in LabWhere to autogenerate samples in Sequencescape
          </p>
        </label>
        <div class="col-sm-8">
          <b-form-input
            id="box-barcode"
            v-model="boxBarcode"
            type="text"
            class="form-control"
            name="box-barcode"
          />
        </div>
      </div>
      <div class="form-group row">
        <div class="col-sm-12">
          <b-button
            id="handleSentinelSampleCreation"
            variant="success"
            class="float-right"
            :disabled="isDisabled"
            @click="handleSentinelSampleCreation()"
            >Submit
          </b-button>
          <b-button id="cancelSearch" variant="primary" class="float-right" @click="cancelSearch()"
            >Cancel
          </b-button>
        </div>
      </div>
    </form>
    <br />
    <h3>Samples created</h3>

    <b-table
      id="samples-table"
      show-empty
      responsive
      :items="items"
      :fields="fields"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      hover
    >
    </b-table>
  </b-container>
</template>

<script>
import api from '@/modules/api'
import Alert from '@/components/Alert'

export default {
  components: {
    Alert,
  },
  data() {
    return {
      fields: [
        { key: 'plate_barcode', label: 'Plate barcode', sortable: true },
        { key: 'centre', label: 'Lighthouse', sortable: true },
        {
          key: 'count_fit_to_pick_samples',
          label: 'Created fit to pick count',
          sortable: true,
        },
      ],
      sortBy: 'plate_barcode',
      sortDesc: true,
      boxBarcode: '',
      items: [],
      submit_disabled: false,
    }
  },
  computed: {
    isDisabled() {
      return this.submit_disabled || this.boxBarcode.length === 0
    },
  },
  methods: {
    async handleSentinelSampleCreation() {
      this.submit_disabled = true
      const resp = await api.createSamples(this.boxBarcode)
      this.handleSentinelSampleCreationResponse(resp)
      this.submit_disabled = false
    },
    // TODO: make this more javascripty? destructuring?
    handleSentinelSampleCreationResponse(resp) {
      const errored = resp.filter((obj) => Object.keys(obj).includes('errors'))
      const successful = resp.filter((obj) => Object.keys(obj).includes('data'))
      if (successful.length > 0) {
        this.items = successful.map((obj) => obj.data).map((obj) => obj.data)
      } else {
        this.items = []
      }
      this.sentinelSampleCreationAlert(errored, successful)
    },
    sentinelSampleCreationAlert(errored, successful) {
      const msg = errored.map((e) => e.errors.join(', ')).join(', ')
      if (errored.length > 0 && successful.length > 0) {
        this.showAlert(`Some samples were successfully created however: ${msg}`, 'warning')
      } else if (errored.length > 0 && successful.length === 0) {
        this.showAlert(msg, 'danger')
      } else if (errored.length === 0 && successful.length > 0) {
        this.showAlert('Sentinel samples successfully created in sequencescape', 'success')
      }
    },
    showAlert(message, type) {
      return this.$refs.alert.show(message, type)
    },
    cancelSearch() {
      this.boxBarcode = ''
    },
  },
}
</script>

<style scoped>
form {
  padding: 10px;
  min-height: 160px;
}
button {
  margin-right: 5px;
}
</style>
