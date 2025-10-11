<template>
  <component :is="component" />
</template>

<script>
import { ORDER_TYPE } from '~/resources/order-type'
import Base from '~/components/common/base.vue'
import Desktop from '~/components/desktop/list-post/index.vue'
import Mobile from '~/components/mobile/list-post/index.vue'

export default {
  name: 'Posts',
  middleware: 'user-domain-redirect',
  components: {
    Mobile,
    Desktop
  },
  extends: Base,
  mixins: [],
  validate ({ params, redirect }) {
    const type = (params.type || '').toUpperCase()
    if ([ORDER_TYPE.BUY, ORDER_TYPE.SELL].includes(type)) {
      return true
    }
    return redirect('/')
  },
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
