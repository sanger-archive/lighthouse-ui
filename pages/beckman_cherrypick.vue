<template>
  <b-container>
    <h1>Beckman Cherrypick</h1>

    <b-tabs card>
      <b-tab title="Create">
        <b-card
          title="Create Destination Plate"
          sub-title="Generate destination plate from DART data so it can continue in pipeline partially filled.">
          <b-card-text>
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
              ></b-form-select>
            </b-form-group>

            <!-- Add disabled -->
            <b-button @click="create" variant="success">Create Destination Plate</b-button>
          </b-card-text>
        </b-card>
      </b-tab>

      <b-tab title="Fail">
        <b-card
          title="Fail Destination Plate"
          sub-title="Fail destination plate with a reason.">
          <b-card-text>
            <b-form-group id="input-group-1" label="Plate Barcode:" label-for="input-1">
              <b-form-input id="input-1" v-model="barcode" required></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-2" label="Username:" label-for="input-2">
              <b-form-input id="input-2" v-model="username" required></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-3" label="Robots:" label-for="input-3">
              <b-form-select
                id="input-3"
                v-model="robot_serial_number"
                :options="robots"
                placeholder="Robots"
                value-field="serial_number"
                text-field="name"
              ></b-form-select>
            </b-form-group>

            <b-form-group id="input-group-4" label="Failure Type:" label-for="input-4">
              <b-form-select
                id="input-4"
                v-model="failure_type"
                :options="failure_types"
                placeholder="Failure Types"
                value-field="type"
                text-field="description"
              ></b-form-select>
            </b-form-group>

            <!-- Add disabled -->
            <b-button @click="create" variant="danger">Fail Destination Plate</b-button>
          </b-card-text>
        </b-card>

      </b-tab>
    </b-tabs>

    {{ username }} {{ robot_serial_number }} {{ barcode }} {{ failure_type }}
  </b-container>
</template>


<script>
// https://ssg-confluence.internal.sanger.ac.uk/display/PSDPUB/Cherrypicking+Events

import lighthouse from '../modules/lighthouse_service'

export default {
  data() {
    return {
      username: '',
      barcode: '',
      robot_serial_number: '',
      robots: [],
      failure_type: '',
      failure_types: [],
    }
  },
  computed: {},
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
    async create() {
      const response = await lighthouse.createDestinationPlate(this.username, this.barcode, this.robot_serial_number)
    },
    async fail() {
      const response = await lighthouse.failDestinationPlate(this.username, this.barcode, this.robot_serial_number, this.failure_type)
    }
  },
  components: {
  },
  created() {
    this.getRobots()
    this.getFailuresTypes()
  },
}
</script>

<style scoped lang="scss">

</style>
