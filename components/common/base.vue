<template>
  <component :is="component" />
</template>

<script>
import debounce from 'lodash/debounce';

const MOBILE = 'mobile';
const DESKTOP = 'desktop';
const MOBILE_WIDTH_THRESHOLD = 1024;

export default {
  data () {
    return {
      deviceType: this.$store.state.device
    };
  },
  layout ({ store }) {
    return (store.state.device === MOBILE ? MOBILE : DESKTOP)
  },
  computed: {
    component () {
      return this.deviceType === MOBILE ? 'Mobile' : 'Desktop';
    },
    layoutType () {
      return this.deviceType === MOBILE ? MOBILE : DESKTOP;
    }
  },
  watch: {
    deviceType (newDeviceType) {
      this.$cookies.set('device', newDeviceType, { path: '/' });
      this.$store.commit('mutate', {
        property: 'device',
        with: newDeviceType
      });
      this.$refreshDevices()
      this.$nuxt.setLayout(this.layoutType);
    }
  },
  beforeMount () {
    window.addEventListener('resize', debounce(this.onResizeWindow, 500));
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResizeWindow);
  },
  methods: {
    onResizeWindow () {
      const newDeviceType = window.innerWidth < MOBILE_WIDTH_THRESHOLD ? MOBILE : DESKTOP;
      if (this.deviceType !== newDeviceType) {
        this.deviceType = newDeviceType;
      }
    }
  }
};
</script>
