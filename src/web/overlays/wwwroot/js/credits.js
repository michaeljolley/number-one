
Vue.config.devtools = true;

Vue.component('sponsors', {
  template: `
      <transition name="openClose" @after-enter="nextSponsor">
        <div v-if="credit" class="sponsor">
          <div class="name">
            <h2>{{credit.displayName}}</h2>
            <ul>
              <li v-if="credit.onSponsor"><i class="fab fa-github"></i> GitHub Sponsor</li>
              <li v-if="credit.onSub"><i class="fas fa-crown"></i> Subscriber</li>
              <li v-if="credit.onCheer"><i class="far fa-gem"></i> Cheer</li>
              <li v-if="credit.onDonation"><i class="fas fa-dollar-sign"></i> Donation</li>
            </ul>
          </div>
        </div>
      </transition>
  `,
  props: ['credits'],
  data: function () {
    return {
      credit: null,
      index: 0
    }
  },
  watch: {
    credits: function (newCredits, oldCredits) {
      if (!oldCredits || oldCredits.length === 0) {
        this.nextSponsor();
      }
    }
  },
  methods: {
    nextSponsor() {
      this.credit = null;

      Vue.nextTick(() => {
        if (this.index === this.credits.length) {
          this.index = 0;
        }

        this.credit = this.credits[this.index];
        this.index++;
      });
    }
  }
});

Vue.component('background', {
  template: `
      <div v-if="bgImageUrl" class="bg" :class="{ shouldTransition: shouldTransition }" :style="background"></div>
  `,
  props: ['images'],
  data: function () {
    return {
      bgImageUrl: null,
      currentIndex: 0
    }
  },
  computed: {
    background: function () {
      return this.bgImageUrl ? {
        backgroundImage: `url('${this.bgImageUrl}')`
      } : null;
    },
    shouldTransition: function () {
      return this.images.length > 119;
    },
    transitionName: function () {
      return this.shouldTransition ? 'fadeInOut' : 'fadeIn';
    }
  },
  watch: {
    images: function (newImages, oldImages) {
      if (oldImages.length === 0 && newImages.length > 0) {
        this.redraw(null, true);
      }
    }
  },
  methods: {
    redraw(el, bypass) {
      if (this.images.length > 0 && (bypass || this.shouldTransition)) {

        URL.revokeObjectURL(this.bgImageUrl);
        this.bgImageUrl = null;

        Vue.nextTick(() => {

          const canvas = document.createElement('canvas');
          const canvasHeight = 400, canvasWidth = 1920;
          canvas.height = canvasHeight;
          canvas.width = canvasWidth;
          const context = canvas.getContext('2d')

          if (this.currentIndex > this.images.length) {
            this.currentIndex = 0;
          }

          let memberImages = [];
          while (memberImages.length < 120) {
            if (this.images.length < 120) {
              memberImages = memberImages.concat(this.images.slice(0, 120 - memberImages.length));
            } else {
              if (this.currentIndex >= this.images.length) {
                this.currentIndex = 0;
              }
              const toAdd = this.images.slice(this.currentIndex, (120 - memberImages.length + this.currentIndex));
              memberImages = memberImages.concat(toAdd);
              this.currentIndex += toAdd.length;
            }
          }

          let xPos = 0, yPos = 0;

          // for each image, draw to canvas
          for (let i = 0; i < memberImages.length; i++) {

            context.drawImage(memberImages[i], xPos + 1, yPos + 1, 78, 78)

            // shift x & y positions
            if (((i + 1) % 24) === 0) {
              yPos += 80
            }
            if (xPos === 1840) {
              xPos = 0
            } else {
              xPos += 80
            }
          }

          canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            this.bgImageUrl = url;
          })
        });
      }
    }
  }
});

const app = new Vue({
  el: '#app',
  template: `
      <div class="credits">
        <background :images="images"/>
        <sponsors :credits="sponsors"/>
      </div>
  `,
  data() {
    return {
      images: [],
      sponsors: []
    }
  },
  methods: {
    async loadImage(url) {
      return new Promise((res, rej) => {
        const imgObj = new Image();
        imgObj.crossOrigin = "anonymous";
        imgObj.onload = () => {
          res(imgObj);
        }
        imgObj.onerror = () => {
          res(null);
        }
        imgObj.src = url;
      });
    },
    async processCredits(onCreditRollEvent) {
      if (onCreditRollEvent && onCreditRollEvent.credits) {
        this.groups = [];
        const credits = onCreditRollEvent.credits;

        this.sponsors = credits.filter(c => c.onCheer || c.onSponsor || c.onDonation || c.onSub)
          .sort(sortFunction);

        const contributors = credits.map(m => m.avatarUrl);

        // load all images
        Promise.all(
          contributors.map((avatarUrl) =>
            this.loadImage(avatarUrl))
        ).then((images) => {
          let tmp = images.filter(f => f);
          tmp = tmp.concat(tmp);
          this.images = tmp;
        });
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
