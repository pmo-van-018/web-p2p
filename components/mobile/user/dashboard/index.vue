<template>
  <Dashboard :overview-render="USER_ROLE.USER" :visible-nick-name="visibleNickName" />
</template>
<script>

import { USER_ROLE } from '@/config/constant.js'

export default {
  components: {
    Dashboard: () => import('~/components/common/dashboard/index.vue')
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
