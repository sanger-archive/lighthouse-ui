<template>
  <b-container>
    <b-row>
      <b-col>
        <h1>Print destination plate labels</h1>
        <p class="lead"></p>
        <p>
          <b-button
            id="printLabels"
            variant="success"
            :disabled="isBusy"
            @click="printLabels"
          >
            Print labels
            <b-spinner v-show="isBusy" small></b-spinner>
          </b-button>
        </p>
        <!-- TODO: better in a component of its own? -->
        <p>
          <b-alert :show="isError" dismissible variant="danger">
            {{ alertMessage }}
          </b-alert>
          <b-alert :show="isSuccess" dismissible variant="success">
            {{ alertMessage }}
          </b-alert>
          <b-alert :show="isBusy" dismissible variant="warning">
            {{ alertMessage }}
          </b-alert>
        </p>
        <p>
          <b-form-select
            id="selectPrinter"
            v-model="printer"
            :options="printers"
          ></b-form-select>
        </p>
        <b-form-input
          id="numberOfBarcodes"
          v-model="numberOfBarcodes"
          type="number"
        ></b-form-input>
        <p>{{ printer }}</p>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import statuses from '@/modules/statuses'
import sprint from '@/modules/sprint'

export default {
  props: {
    printers: {
      type: Array,
      default() {
        return ['heron-bc1', 'heron-bc3', 'heron-bc5']
      }
    }
  },
  data() {
    return {
      status: statuses.Idle,
      alertMessage: '',
      printer: '',
      numberOfBarcodes: 0
    }
  },
  computed: {
    // TODO: abstract and create functions dynamically.
    isIdle() {
      return this.status === statuses.Idle
    },
    isSuccess() {
      return this.status === statuses.Success
    },
    isError() {
      return this.status === statuses.Error
    },
    isBusy() {
      return this.status === statuses.Busy
    }
  },
  methods: {
    setStatus(status, message) {
      this.status = statuses[status]
      this.alertMessage = message
    },
    async printLabels() {
      const response = await sprint.printLabels({
        numberOfBarcodes: this.numberOfBarcodes,
        printer: this.printer
      })

      if (response.success) {
        this.setStatus('Success', response.message)
      } else {
        this.setStatus('Error', response.error)
      }
    }
  }
}
</script>

<style></style>
