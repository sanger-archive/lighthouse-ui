<template>
  <b-container>
    <h1>Lighthouse Sentinel sample creation</h1>
    <h3>Box barcode</h3>
    <form class="border">
      <div class="form-group row">
        <label for="box-barcode" class="col-sm-4 col-form-label"
          >Please scan Lighthouse box barcode</label
        >
        <div class="col-sm-8">
          <b-form-input
            id="box-barcode"
            v-model="boxBarcode"
            type="text"
            class="form-control"
            name="box-barcode"
          />
        </div>
      </div>
      <b-button
        id="findBoxes"
        variant="success"
        class="float-right"
        :disabled="isDisabled"
      >
        Submit
      </b-button>
    </form>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      boxBarcode: ''
    }
  },
  computed: {
    isDisabled() {
      return this.boxBarcode.length === 0
    }
  },
  methods: {}
}
</script>

<style scoped>
form {
  padding: 10px;
  min-height: 160px;
}
</style>
