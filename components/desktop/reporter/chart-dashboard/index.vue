<template>
  <Dashboard :overview-render="overviewRender" :visible-nick-name="visibleNickName" />
</template>
<script>

import Dashboard from '@/components/desktop/dashboard/index.vue'
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
      overviewRender: USER_ROLE.SUPER_ADMIN
    }
  }
};
</script>
