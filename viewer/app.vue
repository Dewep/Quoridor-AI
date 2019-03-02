<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/viewer">Viewer</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
// Define variables to override default ones
$primary-color: #2e5bec;
$dark-color: #3e396b;

// Import full Spectre source code
@import "node_modules/spectre.css/src/spectre";
</style>
