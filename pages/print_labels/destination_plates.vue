<template>
  <b-container>
    <b-row>
      <b-col>
        <PrintLabelsRouter />
        <h1>Print destination plate labels</h1>
        <p class="lead"></p>

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
          <label for="selectPrinter">
            Which printer would you like to use?
          </label>
          <b-form-select
            id="selectPrinter"
            v-model="printer"
            :options="printers"
          ></b-form-select>
        </p>
        <p>
          <label for="numberOfBarcodes">
            How may labels would you like to print?
          </label>
          <b-form-input
            id="numberOfBarcodes"
            v-model="numberOfBarcodes"
            type="number"
            value="1"
            min="1"
          ></b-form-input>
        </p>
        <p class="text-right">
          <b-button
            id="printLabels"
            block
            size="lg"
            variant="success"
            :disabled="isBusy"
            @click="printLabels"
          >
            Print labels
            <b-spinner v-show="isBusy" small></b-spinner>
          </b-button>
        </p>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import statuses from '@/modules/statuses'
import sprint from '@/modules/sprint'
import config from '@/nuxt.config'
import PrintLabelsRouter from '@/components/PrintLabelsRouter'

export default {
  components: {
    PrintLabelsRouter
  },
  props: {
    printers: {
      type: Array,
      default() {
        return config.publicRuntimeConfig.printers.split(',')
      }
    }
  },
  data() {
    return {
      status: statuses.Idle,
      alertMessage: '',
      printer: 'heron-bc1',
      numberOfBarcodes: 1
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
      this.setStatus('Busy', 'Printing labels ...')
      const response = await sprint.printDestinationPlateLabels({
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
