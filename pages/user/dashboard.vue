<template>
  <component :is="component" :visible-nick-name="false" />
</template>

<script>
import Base from '@/components/common/base.vue'

export default {
  middleware: 'authenticated-user',
  components: {
    Mobile: () => import('~/components/mobile/user/dashboard/index.vue'),
    Desktop: () => import('~/components/desktop/user/dashboard/index.vue')
  },
  extends: Base
};
</script>
