<template>
  <b-container>
    <UATActionsRouter />

    <h1 class="mt-3">UAT Actions</h1>

    <Alert id="alert" ref="alert"></Alert>

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

      <b-button
        id="generateTestRunButton"
        variant="outline-success"
        class="float-right"
        :disabled="totalPlates==0 || totalPlates>200"
        @click="generateTestRun"
      >Generate test run</b-button>

      <b-button
        id="resetButton"
        type="reset"
        variant="outline-danger"
        class="float-right"
        @click="resetPlateSpecs"
      >Reset</b-button>
      Total plates: {{ totalPlates }}/200
      <b-form-checkbox
        id="addToDart"
        v-model="addToDart"
        name="addToDart"
        class="float-right"
        value="true"
        unchecked-value="false"
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

function initialFormState (){
  return {
    numberOfPlates: 1,
    numberOfPositives: 0,
  }
}

export default {
  name: 'GenerateTestRun',
  components: {
    Alert,
    UATActionsRouter
  },
  data() {
    return {
      form: initialFormState(),
      addToDart: false,
      plateSpecs: [],
    }
  },
  computed: {
    totalPlates () {
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
      Object.assign(this.$data.form, initialFormState());
    },
    resetPlateSpecs() {
      this.plateSpecs = []
    },
    async generateTestRun() {
      const response = await lighthouse.generateTestRun(this.plateSpecs, this.addToDart)

      if (response.success) {
        this.$router.push({ path: `/uat_actions/test_runs/${response.runId}`})
      } else {
        this.showAlert(response.error, 'danger')
      }
    },
    showAlert(message, type) {
      return this.$refs.alert.show(message, type)
    },
  },
}
</script>

<style scoped lang="scss"></style>
