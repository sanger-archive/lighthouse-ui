<template>
  <b-container>
    <h1>Lighthouse Sentinel sample creation</h1>
    <h3>Box barcode</h3>
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
        <label for="box-check" class="col-sm-4 col-form-label">
          Positives only?
        </label>
        <div>
          <b-form-group label="Positives only?">
            <b-form-radio
              v-model="positivesOnly"
              name="positivesOnly"
              value="true"
              >+ves
            </b-form-radio>
            <b-form-radio
              v-model="positivesOnly"
              name="positivesOnly"
              value="false"
              >+ves & -ves
            </b-form-radio>
          </b-form-group>
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
        { key: 'plateBarcode', label: 'Plate barcode', sortable: true },
        { key: 'lighthouse', label: 'Lighthouse', sortable: true },
        {
          key: 'availablePositivesCount',
          label: 'Available +ves count',
          sortable: true
        },
        {
          key: 'availableNegativesCount',
          label: 'Available -ves count',
          sortable: true
        },
        {
          key: 'availableVoidsCount',
          label: 'Available voids count',
          sortable: true
        },
        {
          key: 'createdPositivesCount',
          label: 'Created +ves count',
          sortable: true
        },
        {
          key: 'createdNegativesCount',
          label: 'Created -ves count',
          sortable: true
        },
        {
          key: 'createdVoidsCount',
          label: 'Created voids count',
          sortable: true
        }
      ],
      sortBy: 'id',
      sortDesc: true,
      boxBarcode: '',
      positivesOnly: true
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
      this.positivesOnly = true
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
</style>
