<template>
  <b-form>
    <b-form-group id='input-group-1' label='Plate Barcode:' label-for='input-1'>
      <b-form-input id='input-1' v-model='form.barcode' trim></b-form-input>
    </b-form-group>

    <b-form-group id='input-group-2' label='Username:' label-for='input-2'>
      <b-form-input id='input-2' v-model='form.username' trim></b-form-input>
    </b-form-group>

    <b-form-group id='input-group-2' label='Robots:' label-for='input-2'>
      <b-form-select
        id='input-robot-select'
        v-model='form.robotSerialNumber'
        :options='robots'
        value-field='serial_number'
        text-field='name'
      ></b-form-select>
    </b-form-group>

    <b-form-group v-if="this.action==='fail'" id='input-group-4' label='Failure Type:' label-for='input-4'>
      <b-form-select
        id='input-4'
        v-model='form.failureType'
        :options='failureTypes'
        value-field='type'
        text-field='description'

      ></b-form-select>
    </b-form-group>

    <!-- Below slot is filled with the actions button -->
    <slot v-bind='{ form, formInvalid }'></slot>
  </b-form>
</template>

<script>
import lighthouse from '@/modules/lighthouse_service'

// This form is used in the BeckmanCherrypick view
// For both Create and Fail Destination Plate
export default {
  name: 'BeckmanCherrypickForm',
  props: {
    action: {
      type: String
    }
  },
  data () {
    return {
      form: {
        username: '',
        barcode: '',
        robotSerialNumber: '',
        failureType: '',
      },
      robots: [],
      failureTypes: [],
    }
  },
  computed: {
    formInvalid() {
      const commonValidation = this.form.username === '' || this.form.barcode === '' || this.form.robotSerialNumber === ''
      if (this.action === 'fail') {
        return commonValidation || this.form.failureType === ''
      }
      return commonValidation
    }
  },
  methods: {
    async getRobots() {
      const response = await lighthouse.getRobots()

      // TODO: check on failure
      if (response.success) {
        this.robots = response.robots
      } else {
        this.robots = []
        // TODO: show error
        // this.setStatus('Error', 'There was an error creating the report')
      }
    },
    async getFailureTypes() {
      const response = await lighthouse.getFailureTypes()

      // TODO: check on failure
      if (response.success) {
        this.failureTypes = response.failure_types
      } else {
        this.failureTypes = []
        // TODO: show error
        // this.setStatus('Error', 'There was an error creating the report')
      }
    },
  },
  async created () {
    await this.getRobots()
    await this.getFailureTypes()
  }
}
</script>

<style scoped lang='scss'>

</style>
