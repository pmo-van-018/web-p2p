<template>
  <component :is="component" />
</template>

<script>

import Base from '~/components/common/base.vue';

export default {
  name: 'PublicViewMerchant',
  components: {
    Mobile: () => import('~/components/mobile/merchant/public-view/index.vue'),
    Desktop: () => import('~/components/desktop/merchant/public-view/index.vue')
  },
  extends: Base,
  mixins: []
}
</script>
