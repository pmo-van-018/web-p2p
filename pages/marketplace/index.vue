<template>
  <component :is="component" />
</template>

<script>
import Base from '~/components/common/base.vue';
import Desktop from '~/components/desktop/list-post/index.vue'
import Mobile from '~/components/mobile/list-post/index.vue'

export default {
  name: 'Marketplace',
  components: {
    Mobile,
    Desktop
  },
  extends: Base,
  middleware: 'user-domain-redirect',
  mixins: [],
  head ({ $config }) {
    return {
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: $config.STATIC_DOMAIN + '/marketplace'
        }
      ]
    }
  }
}
</script>
