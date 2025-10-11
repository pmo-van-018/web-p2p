<template>
  <Dashboard :overview-render="USER_ROLE.MERCHANT_MANAGER" :visible-nick-name="visibleNickName" />
</template>
<script>

import Dashboard from '@/components/common/dashboard/index.vue'
import { USER_ROLE } from '@/config/constant.js'
export default {
  components: {
    Dashboard
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
