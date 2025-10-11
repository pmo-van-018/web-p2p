<template>
  <component :is="component" />
</template>

<script>
import Base from '~/components/common/base.vue';
export default {
  layout: 'management',
  middleware: 'merchant',
  name: 'PostingListing',
  components: {
    Mobile: () => import('~/components/mobile/merchant/postings/index.vue'),
    Desktop: () => import('~/components/desktop/merchant/postings/index.vue')
  },
  extends: Base
};
</script>
