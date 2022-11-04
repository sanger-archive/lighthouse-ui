<template>
  <b-container>
    <b-row>
      <b-col>
        <PrintLabelsRouter />
        <h1>Print reagent aliquot labels</h1>
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
          <img src="@/assets/images/reagent_aliquot_label_preview.png" />
        </p>
        <p>
          <label for="selectPrinter">Which printer would you like to use?</label>
          <b-form-select id="selectPrinter" v-model="printer" :options="printers"></b-form-select>
        </p>
        <p>
          <label for="firstLineText">Freeform first line of text:</label>
          <b-form-input id="firstLineText" v-model="firstLineText" type="text"></b-form-input>
        </p>
        <p>
          <label for="secondLineText">Freeform second line of text:</label>
          <b-form-input id="secondLineText" v-model="secondLineText" type="text"></b-form-input>
        </p>
        <p>
          <label for="barcode">Scan or enter an aliquot barcode:</label>
          <b-form-input id="barcode" v-model="barcode" type="text"></b-form-input>
        </p>
        <p>
          <label for="numberOfLabels">Quantity of labels needed:</label>
          <b-form-input
            id="numberOfLabels"
            v-model="numberOfLabels"
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
            :disabled="isBusy || !isValid"
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
import PrintLabels from '@/modules/sprint_reagent_aliquot_labels'
import config from '@/nuxt.config'
import PrintLabelsRouter from '@/components/PrintLabelsRouter'

export default {
  components: {
    PrintLabelsRouter,
  },
  props: {
    printers: {
      type: Array,
      default() {
        return config.publicRuntimeConfig.printers.split(',')
      },
    },
  },
  data() {
    return {
      status: statuses.Idle,
      alertMessage: '',
      printer: 'heron-bc1',
      firstLineText: '',
      secondLineText: '',
      barcode: '',
      numberOfLabels: 1,
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
    },
    isValid() {
      return this.barcode.length > 0 && this.text.length > 0
    },
  },
  methods: {
    setStatus(status, message) {
      this.status = statuses[status]
      this.alertMessage = message
    },
    async printLabels() {
      const response = await PrintLabels({
        barcode: this.barcode,
        firstText: this.firstLineText,
        secondText: this.secondLineText,
        printer: this.printer,
        quantity: this.quantity,
      })

      if (response.success) {
        this.setStatus('Success', response.message)
      } else {
        this.setStatus('Error', response.error)
      }
    },
  },
}
</script>

<style></style>
