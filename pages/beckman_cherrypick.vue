<template>
  <b-container>
    <h1>Beckman Cherrypick</h1>
    <Alert ref="alert"></Alert>
    <b-card no-body>
      <b-tabs card>
        <b-tab title="Create">
          <b-card
            title="Create Destination Plate"
            sub-title="Generate destination plate from DART data so it can continue in pipeline partially filled."
          >
            <BeckmanCherrypickForm
              v-slot="{ form, formInvalid }"
              :action="'create'"
              :robots="robots"
            >
              <b-button
                variant="success"
                :disabled="formInvalid"
                @click="create(form)"
                >Create Destination Plate</b-button
              >
            </BeckmanCherrypickForm>
          </b-card>
        </b-tab>

        <b-tab title="Fail">
          <b-card
            title="Fail Destination Plate"
            sub-title="Fail destination plate with a reason."
          >
            <BeckmanCherrypickForm
              v-slot="{ form, formInvalid }"
              :action="'fail'"
              :robots="robots"
              :failure-types="failureTypes"
            >
              <b-button
                variant="danger"
                :disabled="formInvalid"
                @click="fail(form)"
                >Fail Destination Plate</b-button
              >
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
  data() {
    return {
      robots: [],
      failureTypes: []
    }
  },
  async mounted() {
    await this.getRobots()
    await this.getFailureTypes()
  },
  methods: {
    async getDataFromLighthouse(lighthouseFunction, dataAttribute) {
      const response = await lighthouseFunction

      if (response.success) {
        this[dataAttribute] = response[dataAttribute]
      } else {
        this[dataAttribute] = []
        const message = response.errors.join(', ')
        const type = 'danger'
        this.showAlert(message, type)
      }
    },
    getRobots() {
      this.getDataFromLighthouse(lighthouse.getRobots(), 'robots')
    },
    getFailureTypes() {
      this.getDataFromLighthouse(lighthouse.getFailureTypes(), 'failureTypes')
    },
    async create(form) {
      let message, type

      const response = await lighthouse.createDestinationPlate(
        form.username,
        form.barcode,
        form.robotSerialNumber
      )
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
      const response = await lighthouse.failDestinationPlate(
        form.username,
        form.barcode,
        form.robotSerialNumber,
        form.failureType
      )

      if (response.success) {
        if (response.errors) {
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
  }
}
</script>

<style scoped lang="scss"></style>
