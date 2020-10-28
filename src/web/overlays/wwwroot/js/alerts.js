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
      activeAudioPlayer: null,
      activeAlert: {
        line1: null,
        line2: null,
        line3: null,
        line4: null,
        audio: null
      }
    };
  },
  methods: {
    addAlert: function (type, data) {
      this.alerts.push({
        type,
        data
      });
    },
    playAudio() {
      if (this.activeAlert &&
        this.activeAlert.audio) {

        let audio = this.$refs.audioFile;
        audio.src = this.activeAlert.audio;
        audio.play().catch(error => {
          console.log(error);
        })
      }
    },
    alertsAudioSrc(audioName) {
      return `assets/audio/alerts/${audioName}.mp3`;
    },
    clipsAudioSrc(audioFileName) {
      return `assets/audio/clips/${audioFileName}`;
    },
    clearAudio() {
      const audio = document.createElement('audio');
      audio.src = '';
    },
    stopAudio() {
      let audio = this.$refs.audioFile;
      audio.pause();
      this.alerts = this.alerts.filter(f => f.line1);
    },
    processNextAlert() {
      const nextAlert = this.alerts[0];
      let name;

      if (nextAlert.type === 'onDonation') {
        name = nextAlert.data.user;
      } else if (nextAlert.data.user) {
        name = nextAlert.data.user.display_name || nextAlert.data.user.login;
      }

      let line1;
      let line2;
      let line3;
      let line4;
      let audio;

      switch (nextAlert.type) {
        case 'onSoundEffect':
          audio = this.clipsAudioSrc(nextAlert.data.filename);
          break;
        case 'onFollow':
          line1 = 'New';
          line2 = 'Follower';
          audio = this.alertsAudioSrc('ohmy');
          break;
        case 'onSub':
          line1 = 'Thanks';
          line2 = name;
          line3 = 'for the sub';
          audio = this.alertsAudioSrc('hair');
          break;
        case 'onRaid':
          line1 = 'Raid';
          line2 = name;
          line3 = 'Alert';
          audio = this.alertsAudioSrc('goodbadugly');
          break;
        case 'onCheer':
          line1 = ' ';
          line2 = name;
          line3 = `cheered  ${nextAlert.data.bits} bits!`;
          audio = this.alertsAudioSrc('cheer');
          break;
        case 'onDonation':
          line1 = 'Donation Alert!';
          line2 = name;
          line3 = `gave  $${nextAlert.data.amount}`;
          audio = this.alertsAudioSrc('donate');
          break;
      }

      this.alerts.shift();
      this.activeAlert = {
        line1: line1 ? line1.split('') : null,
        line2: line2 ? line2.split('') : null,
        line3: line3 ? line3.split('') : null,
        line4: line4 ? line4.split('') : null,
        audio
      };
      this.playAudio();

      setTimeout(() => {
        this.activeAlert = {
          line1: null,
          line2: null,
          line3: null,
          line4: null,
          audio: null
        };
        this.audio = null;
      }, 10000);
    },
    onInterval() {
      if (!this.activeAlert.line1 &&
        !this.activeAlert.audio &&
        this.alerts.length > 0) {
        this.processNextAlert();
      }
    }
  },
  mounted() {
    this.socket = io.connect('/');

    const audio = document.createElement('audio');
    audio.addEventListener('ended', this.clearAudio, false);

    this.socket.on('onSoundEffect', onSoundEffectEvent => {
      this.addAlert('onSoundEffect', onSoundEffectEvent);
    });

    this.socket.on('onStop', onStopEvent => {
      this.stopAudio();
    });

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

    this.socket.on('reconnect', () => {
      window.location.reload();
    });

    console.log("We're loaded and listening the socket.io hub");

    setInterval(this.onInterval, 2000);
  },
  template:
    `<div class="alerts" v-if="activeAlert">
      <audio ref="audioFile"/>
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
