<template>
  <component :is="component" />
</template>

<script>

import Base from '~/components/common/base.vue';

export default {
  middleware: 'blocked-user',
  components: {
    Desktop: () => import('~/components/common/lock/index.vue'),
    Mobile: () => import('~/components/common/lock/index.vue')
  },
  extends: Base,
  mixins: []
}
</script>
