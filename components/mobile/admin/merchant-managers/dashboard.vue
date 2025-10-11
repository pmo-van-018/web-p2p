<template>
  <client-only>
    <div class="role-management w-100">
      <overview-component :is-mobile="$device.isMobileOrTablet" />
    </div>
  </client-only>
</template>

<script>
import isEmpty from 'lodash/isEmpty';
import staffMixin from '@/mixins/admin/staff';

export default {
  components: {
    OverviewComponent: () => import('~/components/mobile/merchant/dashboard/index.vue')
  },
  mixins: [staffMixin],
  data () {
    return {
      isSkeletonLoading: true
    };
  },
  computed: {
    isNotShowTop () {
      return isEmpty(this.merchantManager) || this.isOpenFilter;
    },
    nickName () {
      return this.merchantManager?.nickName.substring(0, 36) + (this.merchantManager?.nickName.length > 36 ? '...' : '')
    }
  },
  async created () {
    await this.$_staffMixin_getMerchantManager();
  }
};
</script>

<style lang="scss" scoped>
@import "static/assets/scss/components/mobile/role-management/index.scss";
</style>
