<template>
  <b-container>
    <UATActionsRouter />

    <h1 class="mt-3">UAT Actions</h1>

    <Alert ref="alert" id="alert"></Alert>

    <b-card title="Generate Test Run" sub-title="Number of plates containing number of positives.">
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

        <b-button id="addButton" variant="outline-primary" @click="add">Add</b-button>
      </b-form>

      <br />
      <b-table striped hover :items="plateSpecs"></b-table>

      <!-- :disabled="isBusy" -->
      <b-button
        id="generateTestRunButton"
        variant="outline-success"
        @click="generateTestRun"
        class="float-right"
        :disabled="totalPlates==0 || totalPlates>200"
      >
        Generate test run
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
import UATActionsRouter from '@/components/UATActionsRouter'

const MAX_NUMBER_OF_POSITIVES = 96
const MAX_NUMBER_OF_PLATES = 200

export default {
  components: {
    Alert,
    UATActionsRouter
  },
  data() {
    return {
      form: {
        numberOfPlates: 1,
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
      return Array.from({length: MAX_NUMBER_OF_POSITIVES + 1}, (v, i) => i)
    },
    numberOfPlatesOptions() {
      return Array.from({length: MAX_NUMBER_OF_PLATES}, (v, i) => i + 1)
    },
    add() {
      this.plateSpecs.push({numberOfPlates: this.form.numberOfPlates, numberOfPositives: this.form.numberOfPositives })
      this.form.numberOfPlates = 1
      this.form.numberOfPositives = 0
    },
    reset() {
      this.plateSpecs = []
    },
    async generateTestRun() {
      const response = await lighthouse.generateTestRun(this.plateSpecs, !!this.addToDart)

      if (response.success) {
        this.showAlert('Redirect to run with id: ' + response.runId, 'success')
      } else {
        this.showAlert(response.errors.join(', '), 'danger')
      }
    },
    showAlert(message, type) {
      return this.$refs.alert.show(message, type)
    },
  },
}
</script>

<style scoped lang="scss"></style>