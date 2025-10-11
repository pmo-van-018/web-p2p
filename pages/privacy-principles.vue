<template>
  <component :is="component" />
</template>

<script>
import Desktop from '@/components/desktop/landing/privacy.vue'
export default {
  layout: 'landing',
  name: 'Privacy',
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
