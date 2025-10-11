<template>
  <section>
    <order-grid-renderer class="management-user">
      <template #head>
        <filters class="management-user__filter" @on-filters="$_userMixin_onFilter" />
        <div class="management-user__head">
          <h3 class="management-user__title">{{ $t('staff.list_user') }}</h3>
          <div class="management-user__reload" @click="$_userMixin_onRefresh">
            <span class="icon-reload"><span class="path1" /><span class="path2" /></span>
          </div>
        </div>
      </template>
      <template #body>
        <list-common
          class="management-user__list"
          key-field="id"
          :loading="isLoading"
          :items="users"
          :total="total"
          :reset-list="page === 1"
          show-empty
          @refresh="$_userMixin_getList"
          @infinite-loading="onInfiniteLoading"
        >
          <template #default="{ item, isLastItem }">
            <card-item
              :key="item.id"
              :item="item"
              :is-last-item="isLastItem"
            />
          </template>
        </list-common>
      </template>
    </order-grid-renderer>
  </section>
</template>
<script>
import usersMixin from '@/mixins/admin/users';

export default {
  components: {
    OrderGridRenderer: () => import('~/components/mobile/orders/order-grid-renderer/index.vue'),
    Filters: () => import('~/components/mobile/admin/users/filters.vue'),
    ListCommon: () => import('~/components/mobile/commons/list/index.vue'),
    CardItem: () => import('~/components/mobile/admin/users/item.vue')
  },
  mixins: [usersMixin],
  methods: {
    async onInfiniteLoading () {
      if (!this.isLoading && this.users.length < this.total) {
        this.page += 1
        await this.$_userMixin_getInfiniteList()
      }
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/admin/users/index.scss">
</style>
