<template>
  <Dashboard :overview-render="USER_ROLE.MERCHANT_MANAGER" :visible-nick-name="visibleNickName" />
</template>
<script>

import { USER_ROLE } from '@/config/constant.js'

export default {
  components: {
    Dashboard: () => import('~/components/desktop/dashboard/index.vue')
  },
  props: {
    visibleNickName: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      USER_ROLE
    }
  }
};
</script>
