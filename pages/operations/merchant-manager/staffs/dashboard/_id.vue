<template>
  <component :is="component" />
</template>

<script>
import Base from '~/components/common/base.vue';

export default {
  layout: 'management',
  components: {
    Desktop: () => import('~/components/desktop/merchant/dashboard/index.vue'),
    Mobile: () => import('~/components/mobile/merchant/dashboard/index.vue')
  },
  extends: Base
};
</script>
