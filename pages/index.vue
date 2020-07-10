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
            variant="success"
            :disabled="isCreating"
            @click="createReport"
          >
            Create report
            <b-spinner v-show="isCreating" small></b-spinner>
          </b-button>
          <b-button variant="info" :disabled="isCreating" @click="refreshTable">
            Refresh
          </b-button>
        </p>
        <p>
          <b-alert :show="isError" dismissible variant="danger">
            There was an error creating the report
          </b-alert>
          <b-alert :show="isCreated" dismissible variant="success">
            Report successfully created
          </b-alert>
          <b-alert :show="isCreating" dismissible variant="warning">
            Report creation takes about 30s to complete, please do not refresh
            the page
          </b-alert>
        </p>
        <b-table
          ref="reports_table"
          :items="reportsProvider"
          :fields="fields"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          sort-icon-left
          no-provider-sorting
        >
          <!-- A virtual column -->
          <template v-slot:cell(index)="data">{{ data.index + 1 }}</template>

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
        { key: 'download_link', label: '' }
      ],
      isCreating: false,
      isError: false,
      isCreated: false
    }
  },
  methods: {
    async reportsProvider(ctx) {
      try {
        const result = await this.$axios.$get(`reports`)
        return result.data.reports
      } catch (error) {
        return []
      }
    },
    async createReport() {
      try {
        this.isCreating = true
        await this.$axios.$post(`reports/new`)
        this.refreshTable()
        this.isCreated = true
        this.isCreating = false
      } catch (error) {
        this.isCreating = false
        this.isError = true
        return []
      }
    },
    refreshTable() {
      this.$refs.reports_table.refresh()
    }
  }
}
</script>

<style></style>
