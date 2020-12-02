<template>
  <div>
    <b-alert
      id="showAlert"
      :variant="type"
      dismissible
      :show="showDismissibleAlert"
      @dismissed="showDismissibleAlert=false">
      {{ this.message }}
    </b-alert>
  </div>
</template>

<script>
export default {
  name: 'Alert',
  data () {
    return {
      message: '',
      type: '',
      showDismissibleAlert: false
    }
  },
  methods: {
    /**
     * Toggle the alert (of type provided) on the page with the provided message
     * @param {*} message the message to show in the alert box
     * @param {string} type the variant (colour) of the alert
     */
    show(message, type = 'primary') {
      this.message = message
      this.type = type
      this.showDismissibleAlert = true
    }
  },
}
</script>
