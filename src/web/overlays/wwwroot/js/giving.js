
Vue.config.devtools = true;

Vue.component('notice', {
  template: `
      <transition name="openClose" @after-enter="clearNotice">
        <div v-if="currentNotice" class="notice">
          <div class="name">
            <h2 :class="{ tier: currentNotice.kidsFed > 29 }">{{currentNotice.headline}}</h2>
            <ul>
              <li v-if="currentNotice.message1">{{currentNotice.message1}}</li>
              <li v-if="currentNotice.message2">{{currentNotice.message2}}</li>
            </ul>
          </div>
        </div>
      </transition>
  `,
  props: ['amount', 'kidsFed', 'show'],
  data: function () {
    return {
      currentNotice: null,
      noticeInterval: null
    }
  },
  watch: {
    show: function (newShow, oldShow) {
      if (newShow) {
        this.showNotice();
      }
    }
  },
  mounted() {
    this.noticeInterval = setInterval(this.showNotice, 60000 * 9);
  },
  destroyed() {
    clearInterval(this.noticeInterval);
  },
  methods: {
    clearNotice() {
      this.currentNotice = null;
    },
    showNotice() {

      const headline = `We've fed ${this.kidsFed} kid${(this.kidsFed !== 1) ? 's' : ''}${(this.kidsFed > 5) ? '!' : ''}`;

      let message1 = 'All subscriptions, donations, & cheers are donated to feed underprivileged kids.';
      let message2 = 'Use the !giving command in chat to learn more.';

      if (this.kidsFed > 30) {
        message1 = `We did it! Our amazing community helped feed ${this.kidsFed} kid${(this.kidsFed !== 1) ? 's' : ''} today!`;
        message2 = "How high can we take it? Our record is 118 kids in one stream."
      } else if (this.kidsFed > 20) {
        message1 = "Uh oh! We're close to lighting the fart candle. BBB, prepare yourself.";
        message2 = "Use the !giving & !fart commands in chat to learn more.";
      } else if (this.kidsFed > 10) {
        message1 = 'If more than 30 kids are fed in a stream, we light the fart candle.';
        message2 = 'Use the !fart command in chat to learn more.';
      }

      this.currentNotice = {
        headline,
        message1,
        message2,
        kidsFed: this.kidsFed
      };
    }
  }
});

const app = new Vue({
  el: '#app',
  template: `
      <div class="giving">
        <notice :amount="amount" :kidsFed="kidsFed" :show="showNotice"/>
      </div>
  `,
  data() {
    return {
      amount: 0,
      kidsFed: 0,
      showNotice: false
    }
  },
  methods: {
    updateAmount(onPocketChangeEvent) {
      if (onPocketChangeEvent) {
        this.amount = onPocketChangeEvent.amount;
        this.kidsFed = onPocketChangeEvent.kidsFed;
      }
    },
    showGivingUpdate() {
      this.showNotice = true;
      Vue.nextTick(() => {
        this.showNotice = false;
      })
    }
  },
  created() {
    this.socket = io.connect('/');

    this.socket.on('onPocketChange', onPocketChangeEvent => {
      this.updateAmount(onPocketChangeEvent);
    });

    this.socket.on('requestGivingUpdate', requestGivingUpdateEvent => {
      this.showGivingUpdate();
    });

    this.socket.on('reconnect', () => {
      window.location.reload();
    });

    console.log("We're loaded and listening to onPocketChange from socket.io");
  },
})
