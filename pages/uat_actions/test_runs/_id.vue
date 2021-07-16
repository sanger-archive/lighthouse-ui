<template>
  <b-container>
    <UATActionsRouter />

    <h1 class="mt-3">UAT Actions</h1>

    <Alert id="alert" ref="alert"></Alert>
    <b-card title="Test Run">
      <div v-if="run.status=='completed'">
        <b-button
          id="printBarcodesButton"
          variant="outline-info"
          class="float-right"
          :disabled="!printerSelected"
          @click="print(barcodesWithText, printerSelected)"
        >Print ALL labels</b-button>

        <b-row>
          <label for="selectPrinter">Which printer would you like to use?</label>
          <b-form-select id="selectPrinter" v-model="printerSelected" :options="printerOptions"></b-form-select>
        </b-row>
        <b-table striped hover :fields="fields" :items="barcodesWithText">
          <template #cell(actions)="row">
            <b-button
              :id="'print-'+row.item.barcode"
              variant="outline-info"
              :disabled="!printerSelected"
              @click="print([row.item], printerSelected)"
            >Print</b-button>
          </template>
        </b-table>
      </div>

      <div v-else-if="run.status=='failed'">
        <span style="color:red" class="font-weight-bold">Failure:</span>
        {{ run.failure_reason}}
      </div>
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
  data() {
    return {
      fields: ['barcode',{ key: 'text', label: 'Description' }, 'actions'],
      run: {},
      printerSelected: null,
      printerOptions: [{value: null, text: 'Please select a printer' }, ...config.publicRuntimeConfig.printers.split(',')],

    }
  },
  computed: {
    barcodesWithText() {
      const list = JSON.parse(this.run.barcodes)
      return list.map((item) => {
        return { barcode: item[0], text: item[1] }
      })
    }
  },
  async created() {
    const response = await lighthouse.getTestRun(this.$route.params.id)
    if (response.success) {
      this.run = response.response
    } else {
      this.showAlert(response.error, 'danger')
    }
  },
  methods: {
    showAlert(message, type) {
      return this.$refs.alert.show(message, type)
    },
    async print(labelFields, printer) {
      const response = await sprint.printLabels({
        labelFields,
        printer,
      })

      if (response.success) {
        this.showAlert(response.message, 'success')
      } else {
        this.showAlert(response.error, 'danger')
      }
    },
  },
}
</script>

<style scoped lang="scss"></style>
