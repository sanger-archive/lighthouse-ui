<template>
  <b-container>
    <h1>Lighthouse Sentinel sample creation</h1>
    <b-alert ref="alert" :show="showDismissibleAlert" variant="danger">
      {{ alertMessage }}
    </b-alert>

    <form class="border">
      <div class="form-group row">
        <label for="box-barcode" class="col-sm-4 col-form-label">
          Please scan Lighthouse box barcode
          <p class="labwhere-warning">
            Box and its contents need to be in LabWhere to autogenerate samples
            in Sequencescape
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
          <b-button
            id="cancelSearch"
            variant="primary"
            class="float-right"
            @click="cancelSearch()"
            >Cancel
          </b-button>
        </div>
      </div>
    </form>
    <h3>Lighthouse Samples created</h3>

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
import { createSamples } from '../modules/api'

export default {
  data() {
    return {
      fields: [
        { key: 'plate_barcode', label: 'Plate barcode', sortable: true },
        { key: 'centre', label: 'Lighthouse', sortable: true },
        {
          key: 'number_of_positives',
          label: 'Created +ves count',
          sortable: true
        }
      ],
      sortBy: 'plate_barcode',
      sortDesc: true,
      boxBarcode: '',
      showDismissibleAlert: false,
      alertMessage: '',
      items: []
    }
  },
  computed: {
    isDisabled() {
      return this.boxBarcode.length === 0
    }
  },
  methods: {
    async handleSentinelSampleCreation() {
      const resp = await createSamples(this.boxBarcode)
      this.handleSentinelSampleCreationResponse(resp)
    },
    handleSentinelSampleCreationResponse(resp) {
      const errored = resp.filter((obj) => Object.keys(obj).includes('errors'))
      if (errored.length > 0) {
        const msg = errored.map((e) => e.errors.join(', ')).join(', ')
        this.alertMessage = msg
        this.showDismissibleAlert = true
      }

      const successful = resp.filter((obj) => Object.keys(obj).includes('data'))
      if (successful.length > 0) {
        this.items = successful.map((obj) => obj.data).map((obj) => obj.data)
      } else {
        this.items = []
      }
    },
    cancelSearch() {
      this.boxBarcode = ''
    }
  }
}
</script>

<style scoped>
form {
  padding: 10px;
  min-height: 160px;
}
.labwhere-warning {
  color: red;
}
button {
  margin-right: 5px;
}
</style>
