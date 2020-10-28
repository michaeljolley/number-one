
Vue.config.devtools = true;

Vue.component('chatMessage', {
  template: '<div class="message" v-bind:class="{ hide: hideMe, mod: onChatMessageEvent.flags.mod, vip: onChatMessageEvent.flags.vip }" v-bind:style="{ order: total - ind }"><div class="panel"><div class="user" v-bind:style="{ backgroundImage: `url(${onChatMessageEvent.user.avatar_url})` }"></div><div class="bubble"><div v-html="onChatMessageEvent.sanitizedMessage"></div><div class="name">{{onChatMessageEvent.user.display_name}}</div></div></div></div>',
  props: ['ind', 'onChatMessageEvent', 'total'],
  data: function () {
    return {
      destroyTimeout: null,
      hideMe: false,
    }
  },
  mounted: function () {
    this.destroyTimeout = setTimeout(() => {
      this.hideMe = true;
      setTimeout(() => {
        this.$emit('removeItem', this.onChatMessageEvent.id);
      }, 1400)
    }, 60000);
  },
  destroyed: function () {
    clearTimeout(this.destroyTimeout);
  }
});

const app = new Vue({
  el: '#app',
  data: function () {
    return {
      messages: [],
      socket: null
    };
  },
  methods: {
    addMessage(onChatMessageEvent) {
      this.messages = [...this.messages, onChatMessageEvent];
      Vue.nextTick(this.checkOverflow);
    },
    removeMessages(count) {
      this.messages = this.messages.slice(count);
    },
    removeItem(id) {
      this.messages = this.messages.filter(f => f.id !== id);
    },
    checkOverflow() {
      const messages = this.$refs.message;
      if (messages) {
        const badGuys = messages.filter(f => {
          return f.$el.getBoundingClientRect().top < 5
        }).length;
        this.removeMessages(badGuys);
      }
    }
  },
  created() {
    this.socket = io.connect('/');

    this.socket.on('onChatMessage', onChatMessageEvent => {
      this.addMessage(onChatMessageEvent);
    });

    this.socket.on('reconnect', () => {
      window.location.reload();
    });

    console.log("We're loaded and listening to 'onChatMessage' from socket.io");
  },
  template: `<div class="chat">
              <transition-group name="list" @after-leave="checkOverflow">
                <chatMessage v-for="(message, index) in messages" :key="message.id" :onChatMessageEvent="message" :ind="index" :total="messages.length" v-on:removeItem="removeItem" ref="message"></chatMessage>
              </transition-group>
            </div>`
})
