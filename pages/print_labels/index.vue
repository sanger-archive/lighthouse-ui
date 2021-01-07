<template>
  <b-container>
    <b-row>
      <b-col>
        <h1>Print Labels</h1>
        <nuxt-link to="/print_destination_plate_labels"
          >Destination plates</nuxt-link
        >
        <nuxt-link to="/print_labels/source_plates">Source plates</nuxt-link>
        <nuxt-link to="/print_labels/control_plates">Control plates</nuxt-link>
        <nuxt-link to="/print_labels/ad_hoc_plate"
          >Ad Hoc plate label</nuxt-link
        >
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  props: {},
  data() {
    return {}
  }
}
</script>

<style></style>
