<template>
  <div class="home">
    <div class="info">
      <h2>Welcome to the stream yo!</h2>
      <p>To begin your session, you must:</p>
      <ul>
        <li>
          Agree to abide by our
          <a
            href="https://baldbeardedbuilder.com/code-of-conduct"
            target="_blank"
          >Code of Conduct</a>
        </li>
        <li>Understand and agree that your video session will be recorded and may be used on our stream</li>
        <li>Login via Twitch (don't worry, we don't store your login info)</li>
      </ul>
      <p>{{url}}</p>
      <p>{{host}}</p>
      <p>
        <router-link class="button" to="recorder">Login with Twitch</router-link>
      </p>
    </div>
  </div>
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
<style scoped lang="scss">
.home {
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;

  ul {
    li {
      margin-bottom: 10px;
    }
  }
}
</style>

