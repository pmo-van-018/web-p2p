<template>
  <section class="order-merchant">
    <div class="order-merchant__head p-2">
      <head-info-staff :info="staff" />
    </div>
    <order-list />
  </section>
</template>
<script>
import { STAFF_BY_ID } from '@/api/staff';
import isEmpty from 'lodash/isEmpty';

export default {
  components: {
    HeadInfoStaff: () => import('~/components/mobile/merchant-manager/staffs/orders/head-info.vue'),
    OrderList: () => import('~/components/mobile/merchant-manager/staffs/orders/list.vue')
  },
  data () {
    return {
      staff: null
    }
  },
  computed: {
    staffId () {
      return this.$route?.params?.id
    }
  },
  async created () {
    await this.getStaff()
  },
  methods: {
    async getStaff () {
      try {
        const result = await this.$axios.$get(STAFF_BY_ID?.(this.staffId));
        if (!isEmpty(result?.data)) {
          this.staff = result.data
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
}
</script>
