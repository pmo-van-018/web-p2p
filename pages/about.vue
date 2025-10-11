<template>
  <landing-about />
</template>

<script>
import LandingAbout from '@/components/desktop/landing/about.vue'
export default {
  layout: 'landing',
  name: 'AboutUs',
  middleware: 'user-domain-redirect',
  scrollToTop: true,
  components: {
    LandingAbout
  }
}
</script>
