<template>
  <div>
    <div>
      <b-navbar ref="navbar" toggleable="md" type="dark" variant="info">
        <b-navbar-brand to="/">Lighthouse</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item to="reports" exact exact-active-class="active">Reports</b-nav-item>
            <b-nav-item to="box_buster" exact exact-active-class="active">Box Buster</b-nav-item>
            <b-nav-item
              to="sentinel_create_samples"
              exact
              exact-active-class="active"
            >Sentinel Sample Creation</b-nav-item>
            <b-nav-item
              to="sentinel_cherrypick"
              exact
              exact-active-class="active"
            >Sentinel Cherrypick</b-nav-item>
            <b-nav-item to="imports" exact exact-active-class="active">Imports</b-nav-item>
            <b-nav-item to="print_labels" exact exact-active-class="active">Print Labels</b-nav-item>
            <b-nav-item to="beckman_cherrypick" exact exact-active-class="active">Beckman Cherrypick</b-nav-item>

            <b-nav-item to="biosero_cherrypick" exact exact-active-class="active">Biosero Cherrypick</b-nav-item>

            <b-nav-item to="uat_actions" exact exact-active-class="active">UAT Actions</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <nuxt />
  </div>
</template>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
