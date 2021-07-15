<template>
  <b-container>
    <UATActionsRouter />

    <h1 class="mt-3">UAT Actions</h1>

    <Alert ref="alert" id="alert"></Alert>

    <b-table
      striped
      hover
      :fields="fields"
      :items="getTestRuns"
      :per-page="perPage"
      :current-page="currentPage"
    >
      <template v-slot:cell(actions)="row">
        <b-button
          :id="'viewTestRun-'+row.item._id"
          :to="'/uat_actions/test_runs/'+row.item._id"
          variant="outline-info"
          :disabled="row.item.status=='pending'"
        >View</b-button>
      </template>
    </b-table>

    <b-pagination
      v-model="currentPage"
      :total-rows="totalRows"
      :per-page="perPage"
      v-if="this.totalRows"
    ></b-pagination>

    <span class="font-weight-bold" v-if="this.totalRows">Total: {{ totalRows }}</span>
  </b-container>
</template>

<script>
import lighthouse from '@/modules/lighthouse_service'
import Alert from '@/components/Alert'
import UATActionsRouter from '@/components/UATActionsRouter'
export default {
  name: 'TestRuns',
  components: {
    Alert,
    UATActionsRouter
  },
  data() {
    return {
      fields: ['_created', 'status', 'add_to_dart', 'actions'],
      perPage: 10,
      currentPage: 1,
      totalRows: 0
    }
  },
  computed: {
  },
  methods: {
    getTestRuns(ctx, callback) {
      lighthouse.getTestRuns(this.currentPage, this.perPage)
      .then(data => {
        this.totalRows = data.total
        if (data.success) {
          callback(data.response)
        } else {
          this.showAlert(data.error, 'danger')
          callback([])
        }
      })
      .catch(() => {
        this.showAlert("An unknown error has occurred", 'danger')
        callback([])
      })
      return null
    },
    showAlert(message, type) {
      return this.$refs.alert.show(message, type)
    },
  },
}
</script>

<style scoped lang="scss"></style>