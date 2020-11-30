<template>
  <b-container>
    <h1>Beckman Cherrypick</h1>

    <b-card no-body>
      <b-tabs card>
        <b-tab title="Create">
          <b-card title="Create Destination Plate" sub-title="Generate destination plate from DART data so it can continue in pipeline partially filled.">
            <BeckmanCherrypickForm v-bind:action="'create'" v-slot="{form, formInvalid}">
              <b-button @click="create(form)" variant="success" :disabled="formInvalid">Create Destination Plate</b-button>
            </BeckmanCherrypickForm>
          </b-card>
        </b-tab>

        <b-tab title="Fail">
          <b-card title="Fail Destination Plate" sub-title="Fail destination plate with a reason.">
            <BeckmanCherrypickForm v-bind:action="'fail'" v-slot="{form, formInvalid}">
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
import lighthouse from '../modules/lighthouse_service'

export default {
  components: {
    BeckmanCherrypickForm,
  },
  methods: {
    async create(form) {
      console.log('create')
      console.log(form)
      // const response = await lighthouse.createDestinationPlate(form.username, form.barcode, form.robot_serial_number)
    },
    async fail(form) {
      console.log('fail')
      console.log(form)
      // const response = await lighthouse.failDestinationPlate(form.username, form.barcode, form.robot_serial_number, form.failure_type)
    }
  }
}
</script>

<style scoped lang="scss">
</style>
