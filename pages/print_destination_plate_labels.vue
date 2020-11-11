<template>
  <b-container>
    <b-row>
      <b-col>
        <h1>Print destination plate labels</h1>
        <p class="lead">
        </p>
        <p>
          <b-button
            id="printLabels"
            variant="success"
            :disabled="isBusy"
            @click="printLabels"
          >
            Create report
            <b-spinner v-show="isBusy" small></b-spinner>
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
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import statuses from '@/modules/statuses'

export default {
  data() {
    return {
      status: statuses.Idle,
      alertMessage: '',
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
    printLabels() {
      return
    }
  }
}
</script>

<style></style>
