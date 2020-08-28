<template>
  <div id="app">
    <Navigation />
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
import Navigation from "./components/Navigation.vue";

export default {
  components: {
    Navigation,
  },
};
</script>

<style lang="scss">
body {
  font-family: "Roboto", sans-serif;

  h2 {
    color: $magenta;
  }
  a {
    color: $purple;
    text-decoration: none;
    &:hover,
    &:active {
      color: $magenta;
    }

    &.button {
      background-color: $black;
      color: $white;
      padding: 15px 25px;
      margin: 15px 0px;

      &:hover,
      &:active {
        color: $magenta;
      }
    }
  }
  .content {
    padding: 15px;
  }
}
</style>
