<template>
  <b-container>
    <h1>Beckman Cherrypick</h1>

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

export default {
  components: {
    BeckmanCherrypickForm,
  },
  data () {
    return {
      robots: [],
      failureTypes: [],
    }
  },
  methods: {
    async getRobots() {
      let msg, status
      const response = await lighthouse.getRobots()

      if (response.success) {
        this.robots = response.robots
      } else {
        this.robots = []
        msg = response.errors.join(', ')
        status = 'danger'
        // Alert
      }
    },
    async getFailureTypes() {
      const response = await lighthouse.getFailureTypes()
      let msg, status
      if (response.success) {
        this.failureTypes = response.failure_types
      } else {
        this.failureTypes = []
        msg = response.errors.join(', ')
        status = 'danger'
        // Alert
      }
    },
    async create(form) {
      let msg, status

      const response = await lighthouse.createDestinationPlate(form.username, form.barcode, form.robotSerialNumber)
      if (response.success) {
        msg = response.response
        status = 'success'
      } else {
        msg = response.errors.join(', ')
        status = 'danger'
      }
      // Alert
    },
    async fail(form) {
      let msg, status
      const response = await lighthouse.failDestinationPlate(form.username, form.barcode, form.robotSerialNumber, form.failureType)

      if (response.success) {
        if (response.errors ){
          msg = response.errors.join(', ')
          status = 'warning'
        } else {
          msg = response.response
          status = 'success'
        }
      } else {
        msg = response.errors.join(', ')
        status = 'danger'
      }
      // Alert
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
