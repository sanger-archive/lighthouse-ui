<template>
  <b-container>
    <h1>Box Buster</h1>
    <p class="lead">
      Quickly overview box contents to assist with cherrypicking
    </p>
    <b-form-group
      id="box-barcode"
      description="Scan in a lighthouse box barcode to show information about all plates contained in the box."
      label="Please scan lighthouse box barcode"
      label-for="box-barcode-field"
    >
      <b-form-input id="box-barcode-field" v-model="barcode" trim>
      </b-form-input>
    </b-form-group>
    <b-table
      :items="items"
      :tbody-tr-class="rowClass"
      show-empty
      :empty-text="empty_text"
    >
      <template #table-caption>
        Box Summary: Total of {{ total }} plates in box; {{ with_maps }} plates
        with plates maps, {{ without_maps }} without
      </template>
    </b-table>
  </b-container>
</template>

<script>
// import lighthouse from '../modules/lighthouse_service'
const countWithMap = (accumulator, { plateMap }) =>
  accumulator + (plateMap ? 1 : 0)
const countWithoutMap = (accumulator, { plateMap }) =>
  accumulator + (plateMap ? 0 : 1)

export default {
  data() {
    return {
      barcode: '',
      items: [
        { barcode: 'AP-rna-00149265', plateMap: true, positiveCount: 8 },
        { barcode: 'AP-rna-00151701', plateMap: true, positiveCount: 5 },
        { barcode: 'AP-rna-00149259', plateMap: true, positiveCount: 2 },
        { barcode: 'AP-rna-00151108', plateMap: false, positiveCount: 0 }
      ]
    }
  },
  computed: {
    total() {
      return this.items.length
    },
    with_maps() {
      return this.items.reduce(countWithMap, 0)
    },
    without_maps() {
      return this.items.reduce(countWithoutMap, 0)
    },
    empty_text() {
      return 'No plates'
    }
  },
  created() {},
  methods: {
    rowClass(item, type) {
      if (item && type === 'row') {
        return item.plateMap ? 'table-success' : 'table-danger'
      } else {
        // Hit with, for example, row empty
        return 'table-warning'
      }
    }
  }
}
</script>
