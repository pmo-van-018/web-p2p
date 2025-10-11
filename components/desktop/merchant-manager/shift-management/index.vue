<template>
  <section class="list-management">
    <client-only>
      <layout-wrapper :title="`${$t('shift_management.title')}`">
        <template #head>
          <tabs-action
            :key="$route.fullPath"
            :tabs="tabsMapped"
            :active-tab="activeTab"
            @on-change-tab="onChangeTab"
          />
        </template>
        <template #action>
          <base-button
            variants="outlined"
            color="primary"
            @click="onExportDataShiftManagement"
          >
            <div class="list-management__action d-flex align-items-center">
              <span class="icon-download mr-2" />
              {{ $t('merchant.overview.action_export') }}
            </div>
          </base-button>
        </template>
        <template #body>
          <component
            :is="activatedComponent"
            :key="$route.fullPath"
            @on-set-total-shift="numberPendingShift = $event"
          />
        </template>
      </layout-wrapper>
      <modal-shift-report />
      <modal-no-data />
    </client-only>
  </section>
</template>
<script>
import { MODAL } from '@/resources/modal';

export default {
  components: {
    LayoutWrapper: () => import('~/components/containers/layout-wrapper/index.vue'),
    TabsAction: () => import('@/components/common/tab-action'),
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    PendingShiftManagement: () => import('~/components/desktop/merchant-manager/shift-management/pending.vue'),
    ApprovedShiftManagement: () => import('~/components/desktop/merchant-manager/shift-management/approved.vue'),
    ModalShiftReport: () => import('~/components/desktop/merchant-manager/shift-management/modal-report.vue'),
    ModalNoData: () => import('~/components/desktop/modal/modal-no-data.vue')
  },
  data () {
    return {
      activatedComponent: 'PendingShiftManagement',
      defaultTab: 'pending',
      numberPendingShift: 0,
      tabs: [
        {
          title: this.$t('tabs.shift.pending'),
          status: 'pending',
          isCount: true,
          count: 0,
          component: 'PendingShiftManagement'
        },
        {
          title: this.$t('tabs.shift.approved'),
          status: 'approved',
          isCount: false,
          count: 0,
          component: 'ApprovedShiftManagement'
        }
      ]
    }
  },
  computed: {
    activeTab () {
      const routeStatus = this.$route?.query?.status || this.defaultTab
      return this.tabsMapped.find(tab => tab.status === routeStatus) || this.firstTab
    },
    firstTab () {
      return this.tabsMapped?.[0];
    },
    tabsMapped () {
      return this.tabs.map((tab) => {
        if (tab.status === 'pending') {
          return { ...tab, count: this.numberPendingShift };
        }
        return tab
      })
    }
  },
  watch: {
    $route: {
      handler () {
        let tab;
        if (!this.activeTab) {
          tab = this.firstTab;
          this.$router.push({ path: this.$route.fullPath, query: { status: this.firstTab?.status } });
        } else {
          tab = this.activeTab;
        }
        this.activatedComponent = tab.component;
      },
      immediate: true
    }
  },
  methods: {
    onChangeTab (tab) {
      if (tab) {
        this.$router.push({ path: this.$route.fullPath, query: { status: tab.status } })
      }
    },
    onExportDataShiftManagement () {
      this.$bvModal.show(MODAL.SHIFT_SUMMARY_REPORT)
    }
  }
}
</script>
<style lang="scss" scoped>
.list-management {
  &__action {
    .icon-download {
      font-size: 20px;
    }
  }
}
</style>
