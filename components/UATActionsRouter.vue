<template>
  <b-navbar ref="navbar" toggleable="md" type="light" class="bg-white" variant="info">
    <b-navbar-nav class="ml-auto">
      <b-nav-item to="/uat_actions/generate_test_run">Generate Test Run</b-nav-item>
      <b-nav-item to="/uat_actions/test_runs">Test Runs</b-nav-item>
      <!-- Test Run page to be removed -->
      <b-nav-item :to="{ name: 'test_run', params: { runId: 123 } }">Test Run</b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
export default {}
</script>
