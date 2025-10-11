<template>
  <component :is="component" :visible-nick-name="false" />
</template>

<script>
import Base from '@/components/common/base.vue'

export default {
  layout: 'management',
  middleware: 'admin',
  components: {
    Mobile: () => import('~/components/mobile/admin/dashboard/index.vue'),
    Desktop: () => import('~/components/desktop/admin/dashboard/index.vue')
  },
  extends: Base
};
</script>
