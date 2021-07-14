<template>
  <b-container>
    <UATActionsRouter />

    <h1 class="mt-3">UAT Actions</h1>

    <Alert ref="alert" id="alert"></Alert>

    <!-- <b-card title="Test Runs" sub-title="Get all test runs"> -->
    <b-table striped hover :fields="fields" :items="getTestRuns">
      <template v-slot:cell(actions)="row">
        <b-button
          :id="'viewTestRun-'+row.item._id"
          :to="'/uat_actions/test_runs/'+row.item._id"
          variant="outline-info"
        >View</b-button>
      </template>
    </b-table>
    <!-- </b-card> -->
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
      fields: ['_id', '_created', '_updated', 'status', 'plate_specs', 'add_to_dart', 'actions'],
    }
  },
  computed: {
  },
  methods: {
    getTestRuns(ctx, callback) {
      lighthouse.getTestRuns()
      .then(data => {
        // this.totalRows = data.response.length
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