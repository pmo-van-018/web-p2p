<template>
  <component :is="component" />
</template>

<script>
import Base from '@/components/common/base.vue'

export default {
  layout: 'management',
  middleware: 'merchant-manager',
  components: {
    Mobile: () => import('~/components/mobile/merchant-manager/posts/index.vue'),
    Desktop: () => import('~/components/desktop/merchant-manager/posts/index.vue')
  },
  extends: Base
};
</script>
