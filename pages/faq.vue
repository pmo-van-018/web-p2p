<template>
  <help-landing />
</template>

<script>
import HelpLanding from '@/components/desktop/landing/help.vue'
export default {
  layout: 'landing',
  name: 'HelpCenter',
  middleware: 'user-domain-redirect',
  scrollToTop: true,
  components: {
    HelpLanding
  }
}
</script>
