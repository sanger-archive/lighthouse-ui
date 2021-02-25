<template>
  <b-container>
    <h1 class="mt-3">Sentinel Cherrypick Batch Creation</h1>
    <b-alert ref="alert" :show="showDismissibleAlert" :variant="pickListResponse.variant">
      {{ pickListResponse.alertMessage
      }}<a :href="pickListResponse.link">{{ pickListResponse.link }}</a>
    </b-alert>

    <form class="border">
      <div class="form-group row">
        <label for="box-barcode" class="col-sm-4 col-form-label">
          Please scan Lighthouse box barcode(s)
          <p class="labwhere-warning">
            Box and its contents need to be in LabWhere and samples created in Sequencescape, to
            generate batch
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
            id="handlePlatesRetrieval"
            variant="success"
            class="float-right"
            :disabled="platesRetrievalDisabled"
            @click="getPlates()"
            >Get plates
          </b-button>
          <b-button id="cancelSearch" variant="primary" class="float-right" @click="cancelSearch()"
            >Cancel
          </b-button>
        </div>
      </div>
    </form>
    <br />
    <h3>Plates to include in batch</h3>
    <b-button
      id="handleSentinelBatchCreationTop"
      variant="success"
      :disabled="batchCreationDisabled"
      @click="createBatch()"
      >Create cherrypick batch
    </b-button>
    <b-table
      id="labware-table"
      show-empty
      responsive
      :items="items"
      :fields="fields"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      hover
      selectable
      :per-page="perPage"
      :current-page="currentPage"
    >
      <template #cell(selected)="row">
        <b-form-group>
          <input v-model="row.item.selected" type="checkbox" />
        </b-form-group>
      </template>
    </b-table>
    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      aria-table="labware-table"
    ></b-pagination>
    <b-button
      id="handleSentinelBatchCreationBottom"
      variant="success"
      :disabled="batchCreationDisabled"
      @click="createBatch()"
      >Create cherrypick batch
    </b-button>
  </b-container>
</template>

<script>
import labwhere from '@/modules/labwhere'
import sequencescape from '@/modules/sequencescape'

export default {
  data() {
    return {
      fields: [
        { key: 'plate_barcode', label: 'Plate barcode', sortable: true },
        { key: 'selected', label: 'Include in batch?', sortable: true },
      ],
      sortBy: 'plate_barcode',
      sortDesc: true,
      boxBarcodes: '',
      showDismissibleAlert: false,
      alertMessage: '',
      items: [],
      pickListResponse: { variant: 'danger' },
      perPage: 10,
      currentPage: 1,
    }
  },
  computed: {
    platesRetrievalDisabled() {
      return this.boxBarcodes.length === 0
    },
    batchCreationDisabled() {
      return this.items.length === 0
    },
    rows() {
      return this.items.length
    },
  },
  methods: {
    async getPlates() {
      const boxBarcodesList = this.parseBoxBarcodes(this.boxBarcodes)
      const resp = await labwhere.getPlatesFromBoxBarcodes(boxBarcodesList)
      this.handleGetPlatesResponse(resp)
    },
    handleGetPlatesResponse(resp) {
      if (!resp.success) {
        this.pickListResponse = {
          alertMessage: 'Could not retrieve plates from LabWhere',
          variant: 'danger',
        }
        this.showDismissibleAlert = true
      } else {
        this.items = resp.barcodes.map((barcode) => ({
          plate_barcode: barcode,
          selected: true,
        }))
      }
    },
    async createBatch() {
      const barcodes = this.items
        .filter((item) => item.selected === true)
        .map((item) => item.plate_barcode)

      if (barcodes.length > 0) {
        const resp = await sequencescape.createCherrypickBatch(barcodes)
        this.handleCreateBatchResponse(resp)
      } else {
        this.pickListResponse = {
          alertMessage: 'Please select one or more plates',
          variant: 'warning',
        }
      }
    },
    handleCreateBatchResponse(resp) {
      if (resp.success) {
        this.pickListResponse = {
          alertMessage: 'Cherrypicking batch successfully created. Go to this link to view it: ',
          variant: 'success',
          link: resp.data.attributes.links[0].url,
        }
      } else {
        this.pickListResponse = {
          alertMessage: resp.error,
          variant: 'danger',
        }
      }
      this.showDismissibleAlert = true
    },
    cancelSearch() {
      this.boxBarcodes = ''
    },
    parseBoxBarcodes(boxBarcodes) {
      const listNoBlanks = boxBarcodes.split(/\s+/).filter((b) => b !== '')
      const listUnique = [...new Set(listNoBlanks)]
      return listUnique
    },
  },
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
  margin: 5px;
}
</style>
