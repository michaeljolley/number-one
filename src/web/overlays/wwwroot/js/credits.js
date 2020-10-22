Vue.config.devtools = true;

Vue.component('user', {
  template: '<div class="message"><div class="panel"><div class="user" v-bind:style="{ backgroundImage: `url(${user.avatarUrl})` }"></div><div class="bubble"><div class="name">{{user.displayName}}</div></div></div></div>',
  props: ['user'],
});

Vue.component('listing', {
  template: `
      <transition name="fadeInOut" v-on:after-enter="afterEnter">
        <div class="listing" v-if="users">
          <user v-for="(user, index) of users" :key="index" :user="user"/>
        </div>
      </transition>
  `,
  props: ['users'],
  methods: {
    afterEnter() {
      this.$emit('usersComplete');
    }
  }
});

Vue.component('group', {
  template: `
        <transition name="slide-in-left" v-on:after-enter="afterEnter">
          <div class="group" v-if="group">
            <h2>{{ group.label }}</h2>
            <listing :users="users" v-on:usersComplete="nextUsers"/>
          </div>
        </transition>
  `,
  props: ['group'],
  data() {
    return {
      users: [],
    }
  },
  methods: {
    afterEnter() {
      if (this.group) {
        this.nextUsers();
      }
    },
    nextUsers() {
      this.users = null;

      Vue.nextTick(() => {
        if (this.group.credits.length) {
          this.users = this.group.credits.splice(0, 15);
        } else {
          this.$emit('groupComplete');
        }
      })
    }
  }
});

const app = new Vue({
  el: '#app',
  template: `<div class="credits">
               <group :group="activeGroup" v-on:groupComplete="runCredits" />
             </div>`,
  data() {
    return {
      activeGroup: null,
      groups: [],
      currentGroup: 0
    }
  },
  methods: {
    processCredits(onCreditRollEvent) {
      if (onCreditRollEvent && onCreditRollEvent.credits) {
        this.groups = [];

        this.loadSupporters(onCreditRollEvent);
        this.loadRaids(onCreditRollEvent);
        this.loadFollowers(onCreditRollEvent);
        this.loadContributors(onCreditRollEvent);

        this.runCredits();
      }
    },
    runCredits() {
      this.activeGroup = null;

      Vue.nextTick(() => {
        if (this.currentGroup > this.groups.length) {
          this.currentGroup = 0;
        }

        this.activeGroup = this.groups[this.currentGroup];

        this.currentGroup++;
      });
    },
    loadSupporters(onCreditRollEvent) {
      const supporterEventTypes = [
        'onCheer',
        'onDonation',
        'onSub'
      ];
      const credits = onCreditRollEvent.credits.filter(f =>
        supporterEventTypes.indexOf(f.eventType) >= 0);
      if (credits && credits.length > 0) {
        const supporters = {
          credits: credits.sort(sortFunction),
          label: 'Supporters'
        };
        this.groups.push(supporters);
      }
    },
    loadRaids(onCreditRollEvent) {
      const credits = onCreditRollEvent.credits.filter(f => f.eventType === 'onRaid');
      if (credits && credits.length > 0) {
        const raids = {
          credits: credits.sort(sortFunction),
          label: 'Raids'
        };
        this.groups.push(raids);
      }
    },
    loadFollowers(onCreditRollEvent) {
      const credits = onCreditRollEvent.credits.filter(f => f.eventType === 'onFollow');
      if (credits && credits.length > 0) {
        const followers = {
          credits: credits.sort(sortFunction),
          label: 'Followers'
        };
        this.groups.push(followers);
      }
    },
    loadContributors(onCreditRollEvent) {
      const nonContributorTypes = [
        'onCheer',
        'onDonation',
        'onSub',
        'onRaid',
        'onFollow'
      ];
      const credits = onCreditRollEvent.credits.filter(f => nonContributorTypes.indexOf(f.eventType) < 0);
      if (credits && credits.length > 0) {
        const contributors = {
          credits: credits.sort(sortFunction),
          label: 'Contributors'
        };
        this.groups.push(contributors);
      }
    }
  },
  created() {
    this.socket = io.connect('/');

    this.socket.on('onCreditRoll', onCreditRollEvent => {
      this.processCredits(onCreditRollEvent);
    });

    this.socket.on('reconnect', () => {
      window.location.reload();
    });

    console.log("We're loaded and listening to 'onCreditRoll' from socket.io");
  },
})

const sortFunction = (a, b) => {
  const A = a.displayName.toUpperCase();
  const B = b.displayName.toUpperCase();
  if (A < B) {
    return -1;
  }
  if (A > B) {
    return 1;
  }
  return 0;
};
