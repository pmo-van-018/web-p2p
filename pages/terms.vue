<template>
  <component :is="component" />
</template>

<script>
import Desktop from '@/components/desktop/landing/term.vue'
export default {
  layout: 'landing',
  name: 'Terms',
  middleware: 'user-domain-redirect',
  scrollToTop: true,
  components: {
    Desktop
  },
  beforeCreate () {
    this.component = 'Desktop'
  }
}
</script>
