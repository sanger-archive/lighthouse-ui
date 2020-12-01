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
// This form is used in the BeckmanCherrypick view
// For both Create and Fail Destination Plate
export default {
  name: 'BeckmanCherrypickForm',
  props: {
    action: {
      type: String
    },
    robots: {
      type: Array
    },
    failureTypes: {
      type: Array
    }
  },
  data () {
    return {
      form: {
        username: '',
        barcode: '',
        robotSerialNumber: '',
        failureType: '',
      }
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
  }
}
</script>

<style scoped lang='scss'>

</style>
