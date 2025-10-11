<template>
  <client-only>
    <div class="role-management">
      <div class="role-management__heading">
        <p class="role-management__title">{{ $t('blacklist.title') }}</p>
        <p class="role-management__description">{{ $t('blacklist.description') }}</p>
      </div>
      <div class="role-management__content">
        <div class="role-management__head">
          <b-skeleton-wrapper :loading="isSkeletonLoading">
            <template #loading>
              <filter-loader-skeleton />
            </template>
            <template #default>
              <blacklist-filter
                @on-create="onOpenModalAddBlackList"
                @on-filters="handleFilterBlackList"
                @on-reset="handleResetFilter"
              />
            </template>
          </b-skeleton-wrapper>
        </div>

        <div class="role-management__body">
          <b-skeleton-wrapper :loading="isSkeletonLoading">
            <template #loading>
              <b-skeleton-table
                :rows="7"
                :columns="7"
                :table-props="{ bordered: false, striped: false }"
              />
            </template>
            <template #default>
              <blacklist-table
                ref="blacklistTable"
                :items="blacklists"
                :page="page"
                :limit="limit"
                :total="total"
                :is-loading="isLoading"
                @get-blacklists="handleLoadFirstPageBlackList"
                @change-pagination="handleChangePagination"
                @change-sort="handleChangeSort"
                @on-reset="handleResetFilter"
              />
            </template>
          </b-skeleton-wrapper>
        </div>
      </div>
      <modal-add-black-list @on-refresh="handleLoadFirstPageBlackList" />
    </div>
  </client-only>
</template>

<script>
import { BLACKLIST_API } from '@/api/blacklist';
import { MODAL } from '@/resources/modal';

export default {
  components: {
    BlacklistFilter: () => import('~/components/desktop/admin/blacklists/blacklist-filter.vue'),
    BlacklistTable: () => import('~/components/desktop/admin/blacklists/blacklist-table.vue'),
    FilterLoaderSkeleton: () => import('~/components/desktop/commons/loader/filters.vue'),
    ModalAddBlackList: () => import('~/components/desktop/admin/blacklists/modal-add-blacklist.vue')
  },
  data () {
    return {
      isSkeletonLoading: true,
      isLoading: false,
      page: 1,
      limit: 10,
      total: 10,
      sortField: 'createdAt',
      sortDirection: 'DESC',
      type: '',
      search: '',
      blacklists: []
    };
  },
  async created () {
    await this.getBlackLists();
    setTimeout(() => {
      this.isSkeletonLoading = false;
    }, 1000);
  },
  methods: {
    async getBlackLists () {
      try {
        this.isLoading = true
        const { data } = await this.$axios.$get(BLACKLIST_API.LIST, {
          params: {
            page: this.page,
            limit: this.limit,
            ...(this.sortField && this.sortDirection) && { orderField: this.sortField },
            ...(this.sortField && this.sortDirection) && { orderDirection: this.sortDirection },
            ...(this.search && { search: this.search }),
            ...(this.type && { type: this.type })
          }
        })
        this.blacklists = data?.items || []
        this.total = data?.totalItems || 0
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },
    async handleFilterBlackList (option) {
      const { type, search } = option
      this.page = 1
      this.type = type
      this.search = search
      await this.getBlackLists()
    },
    async handleChangePagination ({ page, limit }) {
      this.page = page
      this.limit = limit
      await this.getBlackLists()
    },
    async handleChangeSort ({ sortField, sortDirection }) {
      this.page = 1
      this.sortField = sortField
      this.sortDirection = sortDirection
      await this.getBlackLists()
    },
    async handleResetFilter () {
      this.page = 1
      this.limit = 10
      this.sortField = 'createdAt'
      this.sortDirection = 'DESC'
      this.type = ''
      this.search = ''
      await this.getBlackLists()
    },
    async handleLoadFirstPageBlackList () {
      this.page = 1
      await this.getBlackLists()
    },
    onOpenModalAddBlackList () {
      this.$bvModal.show(MODAL.ADD_BLACK_LIST)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/role-management/index.scss" />
