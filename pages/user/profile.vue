<template>
  <Profile />
</template>

<script>

import Base from '~/components/common/base.vue';

export default {
  name: 'UserProfile',
  middleware: 'authenticated-user',
  components: {
    Profile: () => import('~/components/desktop/user/profile/index.vue')
  },
  extends: Base,
  mixins: []
}
</script>
