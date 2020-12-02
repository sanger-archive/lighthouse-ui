<template>
  <b-container>
    <h1>Beckman Cherrypick</h1>
    <Alert ref='alert'></Alert>
    <b-card no-body>
      <b-tabs card>
        <b-tab title="Create">
          <b-card title="Create Destination Plate" sub-title="Generate destination plate from DART data so it can continue in pipeline partially filled.">
            <BeckmanCherrypickForm v-slot="{form, formInvalid}" v-bind:action="'create'" v-bind:robots="this.robots">
              <b-button @click="create(form)" variant="success" :disabled="formInvalid">Create Destination Plate</b-button>
            </BeckmanCherrypickForm>
          </b-card>
        </b-tab>

        <b-tab title="Fail">
          <b-card title="Fail Destination Plate" sub-title="Fail destination plate with a reason.">
            <BeckmanCherrypickForm v-slot="{form, formInvalid}" v-bind:action="'fail'" v-bind:robots="this.robots" v-bind:failureTypes="this.failureTypes">
              <b-button @click="fail(form)" variant="danger" :disabled="formInvalid">Fail Destination Plate</b-button>
            </BeckmanCherrypickForm>
          </b-card>
        </b-tab>
      </b-tabs>
    </b-card>
  </b-container>
</template>

<script>
// https://ssg-confluence.internal.sanger.ac.uk/display/PSDPUB/Cherrypicking+Events

import BeckmanCherrypickForm from '@/components/BeckmanCherrypickForm'
import lighthouse from '@/modules/lighthouse_service'
import Alert from '@/components/Alert'

export default {
  components: {
    BeckmanCherrypickForm,
    Alert
  },
  data () {
    return {
      robots: [],
      failureTypes: [],
    }
  },
  methods: {
    async getRobots() {
      const response = await lighthouse.getRobots()

      if (response.success) {
        this.robots = response.robots
      } else {
        this.robots = []
        let message = response.errors.join(', ')
        let type = 'danger'
        this.showAlert(message, type)
      }
    },
    async getFailureTypes() {
      const response = await lighthouse.getFailureTypes()

      if (response.success) {
        this.failureTypes = response.failure_types
      } else {
        this.failureTypes = []
        let message = response.errors.join(', ')
        let type = 'danger'
        this.showAlert(message, type)
      }
    },
    async create(form) {
      let message, type

      const response = await lighthouse.createDestinationPlate(form.username, form.barcode, form.robotSerialNumber)
      if (response.success) {
        message = response.response
        type = 'success'
      } else {
        message = response.errors.join(', ')
        type = 'danger'
      }
      this.showAlert(message, type)
    },
    async fail(form) {
      let message, type
      const response = await lighthouse.failDestinationPlate(form.username, form.barcode, form.robotSerialNumber, form.failureType)

      if (response.success) {
        if (response.errors ){
          message = response.errors.join(', ')
          type = 'warning'
        } else {
          message = response.response
          type = 'success'
        }
      } else {
        message = response.errors.join(', ')
        type = 'danger'
      }
      this.showAlert(message, type)
    },
    showAlert(message, type) {
      return this.$refs.alert.show(message, type)
    }
  },
  async mounted () {
    await this.getRobots()
    await this.getFailureTypes()
  }
}
</script>

<style scoped lang="scss">
</style>
