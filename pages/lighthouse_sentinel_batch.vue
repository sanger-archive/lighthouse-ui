<template>
  <b-container>
    <h1>Lighthouse Sentinel sample creation</h1>
    <h3>Box barcode</h3>
    <form class="border">
      <div class="form-group row">
        <label for="box-barcode" class="col-sm-4 col-form-label">
          Please scan Lighthouse box barcode
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
        <label for="box-check" class="col-sm-4 col-form-label">
          Positives only?
        </label>
        <div>
          <b-form-checkbox-group
            id="box-check"
            v-model="checkBox"
            class="col-sm-20"
            name="checkbox-validation"
            stacked
            @input="checkCheckBox"
          >
            <b-form-checkbox value="positive">
              +ves
            </b-form-checkbox>
            <b-form-checkbox value="positivesAndNegatives">
              +ves & -ves
            </b-form-checkbox>
          </b-form-checkbox-group>
        </div>
        <div class="col-sm-6">
          <b-button
            id="findBoxes"
            variant="success"
            class="float-right"
            :disabled="isDisabled"
            @click="findBoxes()"
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
      id="libraries-table"
      show-empty
      responsive
      :fields="fields"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      hover
    >
    </b-table>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      fields: [
        { key: 'id', label: 'Plate ID', sortable: true },
        { key: 'lighthouse', label: 'Lighthouse', sortable: true },
        { key: 'positiveCount', label: 'Number of positives', sortable: true },
        { key: 'negativeCount', label: 'Number of negatives', sortable: true },
        { key: 'voidCount', label: 'Number of voids', sortable: true },
        { key: 'positivesCreated', label: 'Created positives', sortable: true },
        { key: 'negativesCreated', label: 'Created negatives', sortable: true },
        { key: 'voidsCreated', label: 'Created voids', sortable: true }
      ],
      sortBy: 'id',
      sortDesc: true,
      boxBarcode: '',
      checkBox: ['positive']
    }
  },
  computed: {
    isDisabled() {
      return this.boxBarcode.length === 0
    }
  },
  methods: {
    findBoxes() {
      return ''
    },
    cancelSearch() {
      this.checkBox = ['positive']
      this.boxBarcode = ''
    },
    checkCheckBox() {
      if (this.checkBox.length > 1) {
        this.checkBox.splice(0, 1)
      }
    }
  }
}
</script>

<style scoped>
form {
  padding: 10px;
  min-height: 160px;
}
</style>
