<template>
  <b-container>
    <h1>Imports</h1>

    <b-alert
      ref="alert"
      dismissible
      :show="showDismissibleAlert"
      :variant="alertData.variant"
    >
      {{ alertData.message }}
    </b-alert>

    <b-table
      id="imports-table"
      show-empty
      responsive
      :items="items"
      :fields="fields"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      hover
      :per-page="perPage"
      :current-page="currentPage"
    >
      <template v-slot:cell(selected)="row">
        <b-form-group>
          <input v-model="row.item.selected" type="checkbox" />
        </b-form-group>
      </template>
    </b-table>
    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      aria-table="imports-table"
    ></b-pagination>
  </b-container>
</template>

<script>
import { getImports } from '../modules/lighthouse_service'

export default {
  data() {
    return {
      fields: [
        { key: 'date', label: 'Date', sortable: true },
        { key: 'centre_name', label: 'Centre', sortable: true },
        { key: 'csv_file_used', label: 'File', sortable: true },
        { key: 'number_of_records', label: 'Num of records', sortable: true },
        { key: 'errors', label: 'Errors', sortable: true }
      ],
      sortBy: 'date',
      sortDesc: true,
      perPage: 10,
      currentPage: 1,
      showDismissibleAlert: false,
      alertData: { variant: '', message: '' },
      items: [],
  computed: {
    rows() {
      return this.items.length
    }
  },
  methods: {
    async getItemsProvider() {
      const resp = await getImports()
      return this.handleItemsResponse(resp)
    },
    handleItemsResponse(response) {
      if (response.success) {
        return response.data._items
      } else {
        this.alertData.variant = 'danger'
        this.alertData.message = response.error
        this.showDismissibleAlert = true
        return []
      }
    },
    async provider() {
      this.items = await this.getItemsProvider()
    }
  },
  created() {
    this.provider()
  }
}
</script>

<style></style>
