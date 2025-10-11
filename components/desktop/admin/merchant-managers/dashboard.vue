<template>
  <client-only>
    <div class="role-management">
      <overview-component :is-mobile="$device.isMobileOrTablet" />
    </div>
  </client-only>
</template>

<script>
import isEmpty from 'lodash/isEmpty';
import staffMixin from '~/mixins/admin/staff';
export default {
  components: {
    OverviewComponent: () => import('~/components/desktop/merchant-manager/dashboard/index.vue')
  },
  mixins: [staffMixin],
  data () {
    return {
      isSkeletonLoading: true
    };
  },
  computed: {
    isShowMerchantManagerInfo () {
      return !isEmpty(this.merchantManager);
    }
  },
  async created () {
    await this.$_staffMixin_getMerchantManager()
  }
}
</script>

<style lang="scss" scoped>
@import "static/assets/scss/components/desktop/role-management/index.scss";
</style>
