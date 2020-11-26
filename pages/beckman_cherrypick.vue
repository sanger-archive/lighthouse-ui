<template>
  <b-container>
    <h1>Beckman Cherrypick</h1>

    <b-tabs card>
      <b-tab title="Create">
        <b-card
          title="Create Destination Plate"
          sub-title="Generate destination plate from DART data so it can continue in pipeline partially filled.">
          <b-card-text>
            <BeckmanCherrypickForm v-bind:action="'create'">
              <b-button @click="create" type="submit" variant="success">Create Destination Plate</b-button>
            </BeckmanCherrypickForm>
          </b-card-text>
        </b-card>
      </b-tab>

      <b-tab title="Fail">
        <b-card
          title="Fail Destination Plate"
          sub-title="Fail destination plate with a reason.">
          <b-card-text>
            <BeckmanCherrypickForm v-bind:action="'fail'">
                <b-button @click="fail" type="submit" variant="danger">Create Destination Plate</b-button>
            </BeckmanCherrypickForm>
          </b-card-text>
        </b-card>
      </b-tab>
    </b-tabs>
  </b-container>
</template>


<script>
// https://ssg-confluence.internal.sanger.ac.uk/display/PSDPUB/Cherrypicking+Events

import BeckmanCherrypickForm from '@/components/BeckmanCherrypickForm'
import lighthouse from '../modules/lighthouse_service'

export default {
  data() {
    return {
    }
  },
  computed: {},
  methods: {
    async create() {
      const response = await lighthouse.createDestinationPlate(this.username, this.barcode, this.robot_serial_number)
    },
    async fail() {
      const response = await lighthouse.failDestinationPlate(this.username, this.barcode, this.robot_serial_number, this.failure_type)
    }
  },
  components: {
    BeckmanCherrypickForm,
  },
  created() {
  },
}
</script>

<style scoped lang="scss">

</style>
