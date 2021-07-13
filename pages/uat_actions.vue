<template>
  <b-container>
    <h1 class="mt-3">UAT Actions</h1>
    <Alert ref="alert" id="alert"></Alert>

    <b-card
      title="Generate Test Run Data"
      sub-title="Number of plates containing number of positives."
    >
      <b-form inline>
        <label class="mr-sm-2" for="numberOfPlates">Number of plates</label>
        <b-form-select
          id="numberOfPlates"
          v-model="form.numberOfPlates"
          class="mb-2 mr-sm-2 mb-sm-0"
          :options="numberOfPlatesOptions()"
        ></b-form-select>

        <label class="mr-sm-2" for="numberOfPositives">Number of positives</label>
        <b-form-select
          id="numberOfPositives"
          v-model="form.numberOfPositives"
          class="mb-2 mr-sm-2 mb-sm-0"
          :options="numberOfPositivesOptions()"
        ></b-form-select>

        <b-button
          id="addButton"
          variant="outline-primary"
          @click="add"
          :disabled="this.form.numberOfPlates == 0"
        >Add</b-button>
      </b-form>

      <br />
      <b-table striped hover :items="plateSpecs"></b-table>

      <!-- :disabled="isBusy" -->
      <b-button
        id="generateTestRunDataButton"
        variant="outline-success"
        @click="generateTestRunData"
        class="float-right"
        :disabled="totalPlates==0 || totalPlates>200"
      >
        Generate test run data
        <!-- <b-spinner v-show="isBusy" small></b-spinner> -->
      </b-button>

      <b-button
        id="resetButton"
        type="reset"
        variant="outline-danger"
        @click="reset"
        class="float-right"
      >Reset</b-button>
      Total plates: {{ totalPlates }}/200
      <b-form-checkbox
        id="addToDart"
        v-model="addToDart"
        name="addToDart"
        class="float-right"
      >Add to DART</b-form-checkbox>
    </b-card>
  </b-container>
</template>

<script>

import lighthouse from '@/modules/lighthouse_service'
import Alert from '@/components/Alert'

const MAX_NUMBER_OF_POSITIVES = 96
const MAX_NUMBER_OF_PLATES = 200

export default {
  components: {
    Alert,
  },
  data() {
    return {
      form: {
        numberOfPlates: 0,
        numberOfPositives: 0,
      },
      addToDart: '',
      plateSpecs: [],
    }
  },
  computed: {
    totalPlates: function () {
      return this.plateSpecs.reduce(function (acc, obj) { return acc + obj.numberOfPlates }, 0)
    }
  },
  methods: {
    numberOfPositivesOptions() {
      return [...Array(MAX_NUMBER_OF_POSITIVES +1).keys()]
    },
    numberOfPlatesOptions() {
      return [...Array(MAX_NUMBER_OF_PLATES +1).keys()]
    },
    add() {
      this.plateSpecs.push({numberOfPlates: this.form.numberOfPlates, numberOfPositives: this.form.numberOfPositives })
      this.form.numberOfPlates = 0
      this.form.numberOfPositives = 0
    },
    reset() {
      this.plateSpecs = []
    },
    async generateTestRunData() {
      const response = await lighthouse.generateTestRunData(this.plateSpecs, !!this.addToDart)

      if (response.success) {
        this.showAlert('Redirect to run with id: ' + response.runId, 'success')
      } else {
        this.showAlert(response.errors, 'danger')
      }
    },
    // handleResponse(response) {
    //   let message, type
    //   if (response.success) {
    //     if (response.errors) {
    //       message = response.errors.join(', ')
    //       type = 'warning'
    //     } else {
    //       message = response.response
    //       type = 'success'
    //     }
    //   } else {
    //     message = response.errors.join(', ')
    //     type = 'danger'
    //   }
    //   this.showAlert(message, type)
    // },
    showAlert(message, type) {
      return this.$refs.alert.show(message, type)
    },
  },
}
</script>

<style scoped lang="scss"></style>
