<template>
  <nav>
    <div class="logo"></div>
    <div class="menu" v-if="isAuthenticated">
      <a href="#" @click.prevent="logout" title="log out">Logout</a>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["isAuthenticated"]),
  },
  methods: {
    logout() {
      this.$auth.logout();
    },
  },
};
</script>
<style scoped lang="scss">
nav {
  display: flex;
  background-color: $black;
  height: 70px;
  justify-content: space-between;

  .logo {
    margin: 15px 20px;
    width: 40px;
    background: url("../assets/bbb-logo.svg") no-repeat;
  }
  .menu {
    margin: 25px 25px;

    a {
      color: $magenta;
      &:hover,
      &:active {
        color: $white;
      }
    }
  }
}
</style>
