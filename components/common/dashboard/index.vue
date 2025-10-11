<template>
  <div>
    <div v-if="userRole === USER_ROLE.USER" class="overview w-100">
      <component :is="component" :overview-user="overviewData" />
    </div>
    <template v-else>
      <client-only>
        <div v-if="userRole !== USER_ROLE.USER" class="overview w-100">
          <OverviewTitle
            :is-show-button="isShowExportButton"
            :is-show-title="isShowTitle"
            :is-mobile="isMobileOrTablet"
            back-button
            :is-loading="isLoadingOverview"
            :staff-name="nickName"
          />
          <div class="overview__container">
            <component :is="component" :overview-user="overviewData" />
            <div class=" wrap-chart">
              <ChartBar />
            </div>
          </div>
        </div>
      </client-only>
    </template>
  </div>
</template>
<script>
import { USER_ROLE } from '@/config/constant.js';
import OverviewTitle from '@/components/common/dashboard/overview-title.vue'
import OverviewUser from '@/components/common/dashboard/overview-user.vue'
import OverviewOperator from '@/components/common/dashboard/overview-operator.vue'
import OverviewManager from '@/components/common/dashboard/overview-manager.vue'
import OverviewAdmin from '@/components/common/dashboard/overview-admin.vue'
import ChartBar from '@/components/common/line-area-chart';
import dashboardMixin from '@/mixins/dashboard/index.js'
import { mapState } from 'vuex';

export default {
  components: {
    OverviewTitle,
    OverviewUser,
    OverviewOperator,
    OverviewManager,
    OverviewAdmin,
    ChartBar
  },
  mixins: [dashboardMixin],
  props: {
    overviewRender: {
      type: String,
      default: ''
    },
    visibleNickName: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      USER_ROLE,
      isMobileOrTablet: this.$device.isMobileOrTablet
    }
  },
  computed: {
    ...mapState('user', ['user']),
    component () {
      switch (this.overviewRender) {
        case this.USER_ROLE.SUPER_ADMIN:
          return OverviewAdmin;
        case this.USER_ROLE.MERCHANT_MANAGER:
          return OverviewManager;
        case this.USER_ROLE.MERCHANT_OPERATOR:
          return OverviewOperator;
        default:
          return OverviewUser
      }
    },
    showBackButton () {
      return this.user?.type !== this.overviewRender;
    },
    isShowTitle () {
      return this.overviewRender === this.user?.type || this.overviewRender === this.USER_ROLE.MERCHANT_OPERATOR
    }
  },
  created () {
    this.getDataDashboard(this.user?.type === this.USER_ROLE.USER)
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/dashboard/index.scss" />
