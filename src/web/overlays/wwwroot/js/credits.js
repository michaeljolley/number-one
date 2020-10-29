
Vue.config.devtools = true;

Vue.component('sponsors', {
  template: `
      <transition name="openClose" @after-enter="nextSponsor">
        <div v-if="credit" class="sponsor">
          <div class="name">
            <h2 :class="{ tier: credit.tier && credit.tier > 5 }">{{credit.displayName}}</h2>
            <ul>
              <li v-if="credit.onSponsor"><i class="fab fa-github"></i> GitHub Sponsor</li>
              <li v-if="credit.onSub"><i class="fas fa-crown"></i> Subscriber</li>
              <li v-if="credit.onCheer"><i class="far fa-gem"></i> Cheer</li>
              <li v-if="credit.onDonation"><i class="fas fa-dollar-sign"></i> Donation</li>
              <li v-if="credit.onRaid"><i class="fas fa-meteor"></i> Raid</li>
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
      <div v-if="bgImageUrl" class="bg" :style="background"></div>
  `,
  props: ['images'],
  data: function () {
    return {
      bgImageUrl: null
    }
  },
  computed: {
    background: function () {
      return this.bgImageUrl ? {
        backgroundImage: `url('${this.bgImageUrl}')`
      } : null;
    }
  },
  watch: {
    images: function (newImages, oldImages) {
      if (oldImages.length === 0 && newImages.length > 0) {
        this.draw();
      }
    }
  },
  methods: {
    draw() {
      if (this.images.length > 0) {

        URL.revokeObjectURL(this.bgImageUrl);
        this.bgImageUrl = null;

        Vue.nextTick(() => {

          const canvas = document.createElement('canvas');
          const canvasHeight = 400, canvasWidth = 1920;
          canvas.height = canvasHeight;
          canvas.width = canvasWidth;
          const context = canvas.getContext('2d')

          let memberImages = [];

          const maxPixels = canvasHeight * canvasWidth;

          const dimensionOptions = [10, 20, 40, 80];
          let imageXY = 0;

          dimensionOptions.forEach((xy) => {
            let pixelCount = xy * xy;
            const imagesPer = maxPixels / pixelCount;
            if (imagesPer > this.images.length) {
              imageXY = xy;
            }
          })

          const imagesPerRow = canvasWidth / imageXY;
          const imagesPerBG = maxPixels / (imageXY * imageXY);

          if (this.images.length === imagesPerBG) {
            memberImages.concat(this.images);
          }

          while (memberImages.length < imagesPerBG) {
            for (let i = this.images.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [this.images[i], this.images[j]] = [this.images[j], this.images[i]];
            }
            memberImages = memberImages.concat(this.images.slice(0, imagesPerBG - memberImages.length));
          }

          let xPos = 0, yPos = 0;

          // for each image, draw to canvas
          for (let i = 0; i < memberImages.length; i++) {
            context.drawImage(memberImages[i], xPos + 1, yPos + 1, imageXY - 2, imageXY - 2)

            // shift x & y positions
            if (((i + 1) % imagesPerRow) === 0) {
              yPos += imageXY
            }
            if (xPos === ((imagesPerRow - 1) * imageXY)) {
              xPos = 0
            } else {
              xPos += imageXY
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
        const contributors = credits.map(m => m.avatarUrl);

        // load all images
        Promise.all(
          contributors.map((avatarUrl) =>
            this.loadImage(avatarUrl))
        ).then((images) => {
          let tmp = images.filter(f => f);
          tmp = tmp.concat(tmp);

          this.images = tmp;
          this.sponsors = credits.filter(c => c.onCheer || c.onSponsor || c.onDonation || c.onSub || c.onRaid)
            .sort(sortFunction);
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
  const aT = a.tier || 0;
  const bT = b.tier || 0;
  const A = a.displayName.toUpperCase();
  const B = b.displayName.toUpperCase();
  if (aT > bT) {
    return -1;
  }
  if (aT < bT) {
    return 1;
  }
  if (A < B) {
    return -1;
  }
  if (A > B) {
    return 1;
  }
  return 0;
};
