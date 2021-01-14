<template>
  <b-navbar
    ref="navbar"
    toggleable="md"
    type="light"
    class="bg-white"
    variant="info"
  >
    <b-navbar-nav class="ml-auto">
      <b-nav-item to="/print_labels/destination_plates"
        >Print Destination plate Labels</b-nav-item
      >
      <b-nav-item to="/print_labels/source_plates"
        >Print Source plate labels</b-nav-item
      >
      <b-nav-item to="/print_labels/control_plates"
        >Print Control plate labels</b-nav-item
      >
      <b-nav-item to="/print_labels/ad_hoc_plate"
        >Print Ad Hoc plate labels</b-nav-item
      >
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
export default {}
</script>
