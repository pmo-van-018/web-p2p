<template>
  <component :is="component" :visible-nick-name="false" />
</template>

<script>
import Base from '@/components/common/base.vue'

export default {
  layout: 'management',
  middleware: 'merchant',
  components: {
    Mobile: () => import('~/components/mobile/merchant/dashboard/index.vue'),
    Desktop: () => import('~/components/desktop/merchant/dashboard/index.vue')
  },
  extends: Base
};
</script>
