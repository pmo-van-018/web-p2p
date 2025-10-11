<template>
  <component :is="component" />
</template>

<script>
import Base from '@/components/common/base'

export default {
  layout: 'management',
  middleware: 'merchant',
  components: {
    Desktop: () => import('@/components/desktop/merchant/posting-detail/index.vue'),
    Mobile: () => import('@/components/desktop/merchant/posting-detail/index.vue')
  },
  extends: Base
};
</script>
