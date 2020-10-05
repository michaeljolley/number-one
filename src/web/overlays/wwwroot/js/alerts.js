Vue.config.devtools = true;

Vue.component('letter', {
  template: '<span class="letter" v-bind:class="[assignedClass,{ off: hideMe}]">{{letter}}</span>',
  props: ['letter'],
  data: function () {
    return {
      hideMe: false,
      classes: ['', 'flicker', 'fast-flicker', 'fast-flicker2'],
      assignedClass: null
    }
  },
  methods: {
    finish: function () {
      this.hideMe = true;
      this.assignedClass = null;
    }
  },
  mounted: function () {
    setTimeout(() => {
      const turnOff = Math.floor(Math.random() * 6) + 3;

      const randomClass = Math.floor(Math.random() * 4);
      if (randomClass !== 0) {
        this.assignedClass = this.classes[randomClass];
      }

      setTimeout(this.finish, turnOff * 1000);
    }, 2500);
  }
});

const app = new Vue({
  el: '#app',
  data: function () {
    return {
      alerts: [],
      socket: null,
      activeAlert: {
        line1: null,
        line2: null,
        line3: null,
        line4: null
      },
      activeAudio: null,
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
      const nextAlert = this.alerts[0];
      let name = nextAlert.data.user.display_name || nextAlert.data.user.login;

      let line1;
      let line2;
      let line3;
      let line4;
      let audio;

      switch (nextAlert.type) {
        case 'onFollow':
          line1 = 'New';
          line2 = 'Follower';
          break;
        case 'onSub':
          line1 = 'Thanks';
          line2 = name;
          line3 = 'for the sub';
          break;
        case 'onRaid':
          line1 = 'Raid';
          line2 = name;
          line3 = 'Alert';
          break;
        case 'onCheer':
          line1 = 'Thanks';
          line2 = name;
          line3 = 'for the bits';
          break;
        case 'onDonation':
          line1 = "You're";
          line2 = name;
          line3 = 'the goat!';
          audio = 'goat';
          break;
      }

      this.alerts.shift();
      this.activeAlert = {
        line1: line1 ? line1.split('') : null,
        line2: line2 ? line2.split('') : null,
        line3: line3 ? line3.split('') : null,
        line4: line4 ? line4.split('') : null
      };
      this.activeAudio = audio;

      setTimeout(() => {
        this.activeAlert = {
          line1: null,
          line2: null,
          line3: null,
          line4: null
        };
        this.audio = null;
      }, 10000);
    },
    onInterval() {
      if (!this.activeAlert.line1 &&
        this.alerts.length > 0) {
        this.processNextAlert();
      }
    }
  },
  mounted() {
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

    this.socket.on('onCheer', onCheerEvent => {
      this.addAlert('onCheer', onCheerEvent);
    });

    this.socket.on('onDonation', onDonationEvent => {
      this.addAlert('onDonation', onDonationEvent);
    });

    console.log("We're loaded and listening the socket.io hub");

    setInterval(this.onInterval, 2000);
  },
  template:
    `<div class="alerts" v-if="activeAlert">
      <transition name="fade">
        <div class="sign pink" v-if="activeAlert.line1">
          <letter v-for="(letter, index) in activeAlert.line1" :key="index" :letter="letter"/>
        </div>
      </transition>
      <transition name="fade">
        <div class="sign blue" v-if="activeAlert.line2">
          <letter v-for="(letter, index) in activeAlert.line2" :key="index" :letter="letter"/>
        </div>
      </transition>
      <transition name="fade">
        <div class="sign blue small" v-if="activeAlert.line4">
          <letter v-for="(letter, index) in activeAlert.line4" :key="index" :letter="letter"/>
        </div>
      </transition>
      <transition name="fade">
        <div class="sign pink" v-if="activeAlert.line3">
          <letter v-for="(letter, index) in activeAlert.line3" :key="index" :letter="letter"/>
        </div>
      </transition>
    </div>`
})
