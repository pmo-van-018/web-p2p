<template>
  <component :is="component" :is-full-width="false" />
</template>

<script>

import Base from '~/components/common/base.vue';

export default {
  name: 'UserPaymentMethod',
  middleware: 'authenticated-user',
  components: {
    Mobile: () => import('~/components/mobile/user/payments/index.vue'),
    Desktop: () => import('~/components/desktop/user/payments/index.vue')
  },
  extends: Base,
  mixins: []
}
</script>
