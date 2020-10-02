Vue.config.devtools = true;

const app = new Vue({
  el: '#app',
  data: function () {
    return {
      alerts: [],
      socket: null,
      activeAlert: 'A New Follower has Joined the Community!'
    };
  },
  methods: {
    addAlert: function (type, data) {
      this.alerts.push({
        type,
        data
      });
    },
    processNextAlert() {
      if (!this.activeAlert && this.alerts.length > 0) {
        const nextAlert = this.alerts[0];
        let message;
        let name = nextAlert.data.user.display_name || nextAlert.data.user.login;
        switch (nextAlert.type) {
          case 'onFollow':
            message = 'A New Follower has Joined the Community!';
            break;
          case 'onSub':
            const months = nextAlert.data.cumulativeMonths;
            if (months > 1) {
              message = `Welcome the Newest Member of the Builders Club, ${name}!`;
            } else {
              message = `${name} has now Spent ${months} months in the Builders Club!`;
            }
            break;
          case 'onRaid':
            message = `Welcome ${name} and your ${nextAlert.data.viewers} friends!`;
            break;
        }

        this.alerts.shift();
        this.activeAlert = message;
      }
    }
  },
  created() {
    this.socket = io.connect('/');

    this.socket.on('onFollow', onFollowEvent => {
      this.addAlert('onFollow', onFollowEvent);
    });

    this.socket.on('onSub', onSubEvent => {
      this.addAlert('onSub', onSubEvent);
    });

    this.socket.on('onRaid', onRaidEvent => {
      this.addAlert('onRaid', onRaidEvent);
    });

    console.log("We're loaded and listening the socket.io hub");
  },
  template: '<div class="alerts"><div v-if="activeAlert" class="message">{{activeAlert}}</div></div>'
})
