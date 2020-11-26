<template>

  <b-form>
    <b-form-group id="input-group-1" label="Plate Barcode:" label-for="input-1">
      <b-form-input id="input-1" v-model="barcode" required></b-form-input>
    </b-form-group>

    <b-form-group id="input-group-2" label="Username:" label-for="input-2">
      <b-form-input id="input-2" v-model="username" required></b-form-input>
    </b-form-group>

    <b-form-group id="input-group-2" label="Robots:" label-for="input-2">
      <b-form-select
        id="input-robot-select"
        v-model="robot_serial_number"
        :options="robots"
        placeholder="Robots"
        value-field="serial_number"
        text-field="name"
        required
      ></b-form-select>
    </b-form-group>

    <b-form-group v-if="this.action==='fail'" id="input-group-4" label="Failure Type:" label-for="input-4">
      <b-form-select
        id="input-4"
        v-model="failure_type"
        :options="failure_types"
        placeholder="Failure Types"
        value-field="type"
        text-field="description"
        required
      ></b-form-select>
    </b-form-group>

    <slot></slot>
  </b-form>

</template>

<script>

export default {
  name: 'BeckmanCherrypickForm',
  data () {
    return {
      // TODO make nested in form?
      username: '',
      barcode: '',
      robot_serial_number: '',
      robots: [],
      failure_type: '',
      failure_types: [],
    }
  },
  props: {
    action: {
      type: String
    }
  },
  methods: {
    async getRobots() {
      // Uncomment below when API ready
      // const response = await lighthouse.getRobots()

      // Remove response when API ready
      let response = {
        success: true,
        robots: [
          {"name": "robot 1", "serial_number": "B00000001"},
          {"name": "robot 2", "serial_number": "B00000002"}
        ]
      }

      // TODO: check on failure

      if (response.success) {
        console.log(response.robots)
        this.robots = response.robots
      } else {
        // TODO: show error
        // this.setStatus('Error', 'There was an error creating the report')
      }
    },
    async getFailuresTypes() {
      // Uncomment below when API ready
      // const response = await lighthouse.getFailureTypes()

      // Remove response when API ready
      let response = {
        success: true,
        failure_types: [
          {"type": "Type 1", "description": "Description of error 1", "display_name": ""},
          {"type": "Type 2", "description": "Description of error 2", "display_name": ""}
        ]
      }

      // TODO: check on failure

      if (response.success) {
        console.log(response.failure_types)
        this.failure_types = response.failure_types
      } else {
        // TODO: show error
        // this.setStatus('Error', 'There was an error creating the report')
      }
    },
  },
  computed: {
  },
  created() {
    this.getRobots()
    this.getFailuresTypes()
  },
  components: {
  }
}
</script>

<style scoped lang="scss">

</style>
