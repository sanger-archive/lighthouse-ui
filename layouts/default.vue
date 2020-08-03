<template>
  <div>
    <div>
      <b-navbar ref="navbar" toggleable="lg" type="dark" variant="info">
        <b-navbar-brand href="/">Lighthouse</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-navbar-nav class="ml-auto">
          <b-nav-item href="/">Reports</b-nav-item>
          <b-nav-item href="sentinel_create_samples"
            >Sentinel Sample Creation</b-nav-item
          >
          <b-nav-item href="sentinel_cherrypick"
            >Sentinel Cherrypick</b-nav-item
          >
          <b-nav-item href="imports">Imports</b-nav-item>
        </b-navbar-nav>
      </b-navbar>
    </div>
    <nuxt />
  </div>
</template>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
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
