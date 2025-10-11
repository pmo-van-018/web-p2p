<template>
  <component :is="component" />
</template>

<script>
import Base from '~/components/common/base.vue';
import { USER_ROLE } from '~/config/constant';

export default {
  name: 'Notification',
  middleware ({ store, redirect }) {
    if (!store.state?.user?.user) {
      return redirect('/marketplace');
    }
    if (store.state?.user?.user === USER_ROLE.SYSTEM_ADMIN) {
      return redirect('/system-admin/system-settings')
    }
  },
  components: {
    Desktop: () => import('~/components/desktop/notification/index.vue'),
    Mobile: () => import('~/components/mobile/notification/index.vue')
  },
  extends: Base
};
</script>
