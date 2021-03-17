Vue.config.devtools = true;


const app = new Vue({
  el: '#app',
  data: function () {
    return {
      socket: null,
      streamDate: null
    };
  },
  methods: {
    sendOrbit() {
      this.socket.emit('onOrbit', this.streamDate);
    },
    sendFullOrbit() {
      this.socket.emit('onFullOrbit', this.streamDate);
    }
  },
  mounted() {
    this.socket = io.connect('/');

    this.socket.on('reconnect', () => {
      window.location.reload();
    });

    console.log("We're loaded and listening the socket.io hub");
  },
  template:
    `<div><input type="text" v-model="streamDate" id="streamDate"/><br/><button type="submit" @click.prevent="sendOrbit">Send onOrbit</button><br/><button type="submit" @click.prevent="sendFullOrbit">Send onFullOrbit</button></div>`
});
