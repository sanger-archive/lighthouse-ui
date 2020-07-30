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
    <br/>
    <b-form-group label="Filter"
                  label-cols-sm="1"
                  label-align-sm="right"
                  label-for="filterInput"
                  class="mb-0">
      <b-input-group>
        <b-form-input v-model="filter"
                      type="search"
                      id="filterInput"
                      placeholder="Type to Search">
        </b-form-input>
        <b-input-group-append>
          <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
        </b-input-group-append>
      </b-input-group>
    </b-form-group>
    <br/>
    <b-table
      id="imports-table"
      show-empty
      responsive
      :items="items"
      :fields="fields"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :filter="filter"
      hover
      :per-page="perPage"
      :current-page="currentPage"
    >
      <template v-slot:cell(errors)="row">
        <ul>
          <li v-for="error in row.item.errors" :key="error">
            {{ error }}
          </li>
        </ul>
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
        {
          key: 'date',
          label: 'Date',
          sortable: true,
          formatter: (value, key, item) => {
            const d = new Date(value)
            return d.toLocaleString()
          },
          filterByFormatted: true
        },
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
      filter: null
    }
  },
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
