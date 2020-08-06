<template>
  <b-container>
    <b-row>
      <b-col>
        <h1>Lighthouse positive samples reports</h1>
        <p class="lead">
          Reports generated for Lighthouse samples which are on site
        </p>
        <p>
          <b-button
            id="createReport"
            variant="success"
            :disabled="isBusy"
            @click="createReport"
          >
            Create report
            <b-spinner v-show="isBusy" small></b-spinner>
          </b-button>
          <b-button variant="info" :disabled="isBusy" @click="refreshTable">
            Refresh
          </b-button>
          <b-button
            id="deleteReports"
            variant="danger"
            :disabled="isBusy"
            @click="deleteReports"
          >
            Delete Reports
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
        <b-table
          ref="reports_table"
          :items="items"
          :fields="fields"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          sort-icon-left
          no-provider-sorting
        >
          <!-- A virtual column -->
          <template v-slot:cell(index)="data">{{ data.index + 1 }}</template>
          <template v-slot:cell(selected)="row">
            <b-form-group class="selected">
              <input v-model="row.item.selected" type="checkbox" />
            </b-form-group>
          </template>

          <template v-slot:cell(download_link)="data">
            <b-button variant="primary" :href="data.item.download_url" download>
              Download
            </b-button>
          </template>
        </b-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { deleteReports } from '@/modules/lighthouse_service'
import statuses from '@/modules/statuses'

export default {
  data() {
    return {
      sortBy: 'filename',
      sortDesc: true,
      fields: [
        // A virtual column that doesn't exist in items
        { key: 'index', label: '' },
        { key: 'filename', sortable: true },
        'size',
        { key: 'download_link', label: '' },
        { key: 'selected', label: 'delete' }
      ],
      status: statuses.Idle,
      alertMessage: '',
      items: []
    }
  },
  computed: {
    reportsToDelete() {
      return this.items
        .filter((item) => item.selected === true)
        .map((item) => item.filename)
    },
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
  created() {
    this.provider()
  },
  methods: {
    async reportsProvider(ctx) {
      try {
        // TODO: move to lighthouse service module
        const data = await this.$axios.$get(
          // TODO: we need to use config. But cant get it loaded
          `${process.env.LIGHTHOUSE_BASE_URL}/reports`
        )
        const reports = data.reports.map((report) => ({
          ...report,
          selected: false
        }))
        return reports
      } catch (error) {
        return []
      }
    },
    async createReport() {
      try {
        this.setStatus(
          'Busy',
          'Report creation takes about 30s to complete, please do not refresh the page'
        )
        // TODO: move this to lighthouse service module
        await this.$axios.$post(
          // TODO: we need to use config. But cant get it loaded
          `${process.env.LIGHTHOUSE_BASE_URL}/reports/new`
        )
        this.refreshTable()
        this.setStatus('Success', 'Report successfully created')
      } catch (error) {
        this.setStatus('Error', 'There was an error creating the report')
        return []
      }
    },
    async deleteReports() {
      if (this.reportsToDelete.length === 0) return
      this.setStatus('Busy', 'Deleting reports ...')
      const response = await deleteReports(this.reportsToDelete)

      if (response.success) {
        this.refreshTable()
        this.setStatus('Success', 'Reports successfully deleted')
      } else {
        this.setStatus('Error', response.error)
      }
    },
    refreshTable() {
      this.$refs.reports_table.refresh()
    },
    async provider() {
      this.items = await this.reportsProvider()
    },
    setStatus(status, message) {
      this.status = statuses[status]
      this.alertMessage = message
    }
  }
}
</script>

<style></style>
