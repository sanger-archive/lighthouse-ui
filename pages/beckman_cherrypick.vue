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
      const response = await lighthouse.getRobots()

      if (response.success) {
        this.robots = response.robots
      } else {
        this.robots = []
        // TODO: handle error
        console.log(response.errors)
        // this.setStatus('Error', 'There was an error creating the report')
      }
    },
    async getFailureTypes() {
      const response = await lighthouse.getFailureTypes()

      if (response.success) {
        this.failureTypes = response.failure_types
      } else {
        this.failureTypes = []
        // TODO: handle error
        console.log(response.errors)
        // this.setStatus('Error', 'There was an error creating the report')
      }
    },
    async create(form) {
      const response = await lighthouse.createDestinationPlate(form.username, form.barcode, form.robot_serial_number)
      console.log(response)
    },
    async fail(form) {
      const response = await lighthouse.failDestinationPlate(form.username, form.barcode, form.robot_serial_number, form.failure_type)
      console.log(response)
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
