<template>
  <section class="order-management">
    <div class="order-management__container">
      <div class="order-management__head">
        <client-only>
          <template #placeholder>
            <skeleton-head-info />
          </template>
          <head-info-staff :info="staff" />
        </client-only>
      </div>
      <div class="order-management__body">
        <order-list />
      </div>
    </div>
  </section>
</template>
<script>
import { STAFF_BY_ID } from '@/api/staff';
import isEmpty from 'lodash/isEmpty';

export default {
  components: {
    OrderList: () => import('~/components/desktop/merchant-manager/staffs/orders/list/index.vue'),
    HeadInfoStaff: () => import('~/components/desktop/merchant-manager/staffs/orders/info/index.vue'),
    SkeletonHeadInfo: () => import('~/components/desktop/merchant-manager/staffs/orders/info/skeleton.vue')
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
<style lang="scss" scoped src="static/assets/scss/components/desktop/role-management/orders/index.scss">
</style>
