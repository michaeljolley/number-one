<template>
  <div>User: {{this.user}}</div>
</template>

<script>
export default {
  computed: {
    user: function () {
      return this.$auth.user;
    },
  },
};
</script>