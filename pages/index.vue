<template>
  <desktop />
</template>

<script>
import Desktop from '~/components/desktop/landing/home/index.vue';
export default {
  layout: 'landing',
  name: 'HomePage',
  middleware: 'user-domain-redirect',
  components: {
    Desktop
  },
  scrollToTop: true,
  mixins: [],
  head ({ $config }) {
    return {
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: $config.STATIC_DOMAIN
        }
      ]
    }
  }
}
</script>
