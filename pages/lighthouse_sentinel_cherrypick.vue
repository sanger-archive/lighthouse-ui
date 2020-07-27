<template>
  <b-container>
    <h1>Lighthouse Sentinel cherrypick batch creation</h1>
    <b-alert ref="alert" :show="showDismissibleAlert" variant="danger">
      {{ alertMessage }}
    </b-alert>

    <form class="border">
      <div class="form-group row">
        <label for="box-barcode" class="col-sm-4 col-form-label">
          Please scan Lighthouse box barcode(s)
          <p class="labwhere-warning">
            Box and its contents need to be in LabWhere and samples created in
            Sequencescape, to generate batch
          </p>
        </label>
        <div class="col-sm-8">
          <b-form-textarea
            id="box-barcodes"
            v-model="boxBarcodes"
            rows="5"
            max-rows="6"
          ></b-form-textarea>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-sm-12">
          <b-button
            id="handleSentinelSampleCreation"
            variant="success"
            class="float-right"
            :disabled="isDisabled"
            @click="getPlates()"
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
    <h3>Plates to include in batch</h3>
    <b-button
      id="handleSentinelSampleCreation"
      variant="success"
      class="float-right"
      :disabled="isDisabled"
      @click="createCherrypickingBatch()"
      >Submit
    </b-button>

    <b-table
      id="libraries-table"
      show-empty
      responsive
      :items="items"
      :fields="fields"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      hover
      selectable
    >
      <template v-slot:cell(selected)="row">
        <b-form-group>
          <input v-model="row.item.selected" type="checkbox" />
        </b-form-group>
      </template>
    </b-table>
  </b-container>
</template>

<script>
import { getPlatesFromBoxBarcodes } from '../modules/labwhere'
import { createCherrypickBatch } from '../modules/sequencescape'

export default {
  data() {
    return {
      fields: [
        { key: 'plate_barcode', label: 'Plate barcode', sortable: true },
        { key: 'selected', label: 'Include in batch?' }
      ],
      sortBy: 'plate_barcode',
      sortDesc: true,
      boxBarcodes: '',
      showDismissibleAlert: false,
      alertMessage: '',
      items: []
    }
  },
  computed: {
    isDisabled() {
      return this.boxBarcodes.length === 0
    }
  },
  methods: {
    async getPlates() {
      const resp = await getPlatesFromBoxBarcodes(this.boxBarcodes)
      this.items = resp.map((barcode) => ({
        plate_barcode: barcode,
        selected: true
      }))
    },
    async createCherrypickingBatch() {
      console.log(this.items)
      const plateBarcodes = this.items
        .filter((item) => item.selected === true)
        .map((item) => item.plate_barcode)

      const resp = await createCherrypickBatch(plateBarcodes)
    }
    // async handleSentinelSampleCreation() {
    //   const resp = await handleApiCall(this.boxBarcode)
    //   this.handleSentinelSampleCreationResponse(resp)
    // },
    // handleSentinelSampleCreationResponse(resp) {
    //   const errored = resp.filter((obj) => Object.keys(obj).includes('errors'))
    //   if (errored.length > 0) {
    //     const msg = errored.map((e) => e.errors.join(', ')).join(', ')
    //     this.alertMessage = msg
    //     this.showDismissibleAlert = true
    //   }
    //   const successful = resp.filter((obj) => Object.keys(obj).includes('data'))
    //   if (successful.length > 0) {
    //     this.items = successful.map((obj) => obj.data).map((obj) => obj.data)
    //   } else {
    //     this.items = []
    //   }
    // },
    // cancelSearch() {
    //   this.boxBarcode = ''
    // }
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
