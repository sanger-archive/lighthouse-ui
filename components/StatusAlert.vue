<template>
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
  },
  methods: {
    setStatus(status, message) {
      this.status = statuses[status]
      this.alertMessage = message
    },
  }
}
</script>
