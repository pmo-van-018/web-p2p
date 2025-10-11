<template>
  <component :is="component" />
</template>

<script>
import Base from '@/components/common/base'

export default {
  layout: 'management',
  middleware: 'admin',
  name: 'AppealDetail',
  components: {
    Desktop: () => import('@/components/desktop/admin/appeal-detail/index.vue'),
    Mobile: () => import('@/components/mobile/admin/appeal-detail/index.vue')
  },
  extends: Base,
  mixins: []
};
</script>
