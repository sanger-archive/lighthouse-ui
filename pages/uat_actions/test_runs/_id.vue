<template>
  <b-container>
    <UATActionsRouter />

    <h1 class="mt-3">UAT Actions</h1>

    <Alert ref="alert" id="alert"></Alert>
    <b-card title="Test Run" sub-title="Details about test run with id: ">
      <b-table striped hover :fields="fields" :items="run.barcodes"></b-table>
      <b-row>
        <label for="selectPrinter">Which printer would you like to use?</label>
        <b-form-select id="selectPrinter" v-model="printerSelected" :options="printerOptions"></b-form-select>

        <b-button
          id="printBarcodesButton"
          variant="outline-info"
          class="float-right"
          @click="print"
        >Print ALL labels</b-button>
      </b-row>
    </b-card>
  </b-container>
</template>

<script>
import lighthouse from '@/modules/lighthouse_service'
import Alert from '@/components/Alert'
import UATActionsRouter from '@/components/UATActionsRouter'
import config from '@/nuxt.config'
import sprint from '@/modules/sprint'

export default {
  name: 'TestRun',
  components: {
    Alert,
    UATActionsRouter
  },
  props: ['runId'],
  data() {
    return {
      fields: ['barcode', 'number_of_positives'],
      run: {},
      printerSelected: null,
      printerOptions: [{value: null, text: 'Please select a printer' }, ...config.publicRuntimeConfig.printers.split(',')],

    }
  },
  computed: {
    labelFields: function () {
      return this.run.barcodes.map((barcode) => {
        return { barcode: barcode, text: barcode.number_of_positives }
      })
    }
  },
  methods: {
    showAlert(message, type) {
      return this.$refs.alert.show(message, type)
    },
    async print() {
      const response = await sprint.printLabels({
        labelFields: this.labelFields,
        printer: this.printerSelected,
      })

      if (response.success) {
        this.showAlert('Labels successfully printed', 'success')
      } else {
        this.showAlert(response.error, 'danger')
      }
    },
  },
  async created() {
    const response = await lighthouse.getTestRun(this.$route.params.id)
    if (response.success) {
      this.run = response.response
    } else {
      this.showAlert('There was a problem: '+response.errors.join(', '), 'danger')
    }
  },
}
</script>

<style scoped lang="scss"></style>
