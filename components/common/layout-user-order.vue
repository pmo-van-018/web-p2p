<template>
  <section class="user-orders">
    <div class="user-orders__container">
      <div class="user-orders__head">
        <div class="container">
          <div class="tab-head">
            <h3 class="tab-head__title">{{ $t('user_orders.title') }}</h3>
            <div class="tab-head__action">
              <tabs-action
                :tabs="tabsMapped"
                :active-tab="activeTab"
                @on-change-tab="onChangeUserOrder"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="user-orders__body">
        <client-only>
          <div class="container">
            <slot />
          </div>
        </client-only>
      </div>
    </div>
  </section>
</template>

<script>
import findIndex from 'lodash/findIndex'
import { mapState } from 'vuex'

export default {
  components: {
    TabsAction: () => import('@/components/common/tab-action')
  },
  data () {
    return {
      tabs: [
        {
          name: 'user-pending-orders',
          title: 'Đang chờ',
          link: '/user/orders?status=pending',
          isCount: true,
          count: 0
        },
        {
          name: 'user-completed-orders',
          title: 'Hoàn thành',
          link: '/user/orders?status=completed',
          isCount: false,
          count: 0
        }
      ]
    }
  },
  computed: {
    ...mapState('user-orders', ['total', 'totalPendingOrder']),
    activeTab () {
      const routeName = this.$route.name
      return findIndex(this.tabs, (tab) => {
        return tab.name === routeName
      }) || 0
    },
    countPendingOrder () {
      return this.totalPendingOrder || 0
    },
    tabsMapped () {
      return this.tabs.map((tab) => {
        if (tab.name === 'user-pending-orders') {
          return { ...tab, count: this.countPendingOrder }
        }
        return tab
      })
    }
  },
  methods: {
    onChangeUserOrder (tab) {
      if (tab) {
        this.$router.push(tab.link)
      }
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/layout-user-order.scss">
</style>
