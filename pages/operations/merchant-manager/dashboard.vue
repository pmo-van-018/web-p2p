<template>
  <component :is="component" :visible-nick-name="false" />
</template>

<script>
import Base from '@/components/common/base.vue'

export default {
  layout: 'management',
  middleware: 'merchant-manager',
  components: {
    Mobile: () => import('~/components/mobile/merchant-manager/dashboard/index.vue'),
    Desktop: () => import('~/components/desktop/merchant-manager/dashboard/index.vue')
  },
  extends: Base
};
</script>
