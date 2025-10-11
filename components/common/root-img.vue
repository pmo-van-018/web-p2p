<template>
  <img :src="src.indexOf('svg') > 0 ? src : imageSrc" :alt="alt" :loading="lazy">
</template>
<script>
export default {
  name: 'RootImg',
  props: {
    src: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      default: ''
    },
    lazy: {
      type: String,
      default: 'eager'
    }
  },
  data () {
    return {
      imageSrc: ''
    };
  },
  mounted () {
    this.imageSrc = this.src;

    const validWebpBrowsers = [
      {
        name: 'Safari',
        minVersion: 14
      },
      {
        name: 'Opera',
        minVersion: 19
      },
      {
        name: 'Chrome',
        minVersion: 32
      },
      {
        name: 'Firefox',
        minVersion: 65
      },
      {
        name: 'Edge',
        minVersion: 18
      }
    ];

    if (validWebpBrowsers.some(os => this.browser.name === os.name && this.browser.version >= os.minVersion)) {
      this.imageSrc = this.fullSrcWebp;
    }
  },
  computed: {
    fullSrcWebp () {
      return this.checkUrl(this.src, 'webp');
    },
    browser () {
      const ua = navigator.userAgent; let tem; let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
      if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return { name: 'IE', version: (tem[1] || '') };
      }
      if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR|Edge\/(\d+)/)
        if (tem != null) { return { name: 'Opera', version: tem[1] }; }
      }
      M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
      if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
      return {
        name: M[0],
        version: M[1]
      };
    }
  },
  methods: {
    checkUrl (src, type) {
      if (type === src.split('.')[src.split('.').length - 1]) {
        return src;
      }

      return src.replace(src.split('.')[src.split('.').length - 1], type);
    }
  }
};
</script>
