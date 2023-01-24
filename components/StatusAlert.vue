<template>
  <p>
    <b-alert :show="isShown" dismissible :variant="alertVariant">
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
    isBusy() {
      return this.status === statuses.Busy
    },
    isSuccess() {
      return this.status === statuses.Success
    },
    isError() {
      return this.status === statuses.Error
    },
    isShown() {
      return this.isBusy || this.isError || this.isSuccess
    },
    alertVariant() {
      switch (this.status) {
        case statuses.Error:
          return "danger"
        case statuses.Success:
          return "success"
        case statuses.Busy:
          return "warning"
        default:
          return ""
      }
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
