<template>
  <div class="postings">
    <client-only>
      <template #placeholder>
        <div class="p-4">
          <filter-loader-skeleton class="delay-animation" />
          <b-skeleton-table
            class="delay-animation"
            :rows="7"
            :columns="4"
            :table-props="{ bordered: false, striped: false }"
          />
        </div>
      </template>
      <p class="postings__title font-t20b grey-900">{{ $t('postings.list') }}</p>
      <div class="postings__content">
        <div class="postings__head">
          <posting-filter
            is-visible-date-picker
            :loading="isLoading"
            @on-filters="onFilterPosting"
          />
        </div>
        <posts-table
          ref="postingTable"
          :fields="fields"
          :items="postsListing"
          :page="page"
          :limit="limit"
          :total="total"
          :is-loading="isLoading"
          @change-sort="handleChangeSort"
          @change-pagination="handleChangePagination"
          @on-change-status="onOpenChangeStatusModal"
        />
      </div>
      <modal-set-posting-status @handle-click="onToggleStatusPosting" />
    </client-only>
  </div>
</template>

<script>
import { MERCHANT_MANAGER_LIST_POST, MERCHANT_MANAGER_UPDATE_POST } from '@/api/post'
import { STATUS_AVAILABLE_FILTER } from '@/resources/postings-management';
import { MODAL } from '@/resources/modal';
import { mapActions, mapState } from 'vuex';
import { POST_STATUS, POST_STATUS_TYPE } from '@/constants/posts';
import { RESPONSE_ICON } from '@/resources/message';

export default {
  components: {
    PostsTable: () => import('~/components/desktop/merchant-manager/posts/posts-table.vue'),
    PostingFilter: () => import('~/components/desktop/merchant-manager/posts/posts-filter.vue'),
    FilterLoaderSkeleton: () => import('~/components/desktop/commons/loader/filters.vue'),
    ModalSetPostingStatus: () => import('~/components/common/modal/modal-set-posting-status.vue')
  },
  data () {
    return {
      isLoading: false,
      page: 1,
      limit: 10,
      total: 0,
      orderField: 'createdAt',
      orderDirection: 'DESC',
      assetId: null,
      postType: null,
      searchField: null,
      searchValue: null,
      status: STATUS_AVAILABLE_FILTER,
      postsListing: [],
      fields: [
        {
          key: 'type',
          label: this.$t('postings.table.post_id'),
          subLabel: this.$t('postings.table.post_asset'),
          sortField: '',
          isSort: false,
          thStyle: {
            width: '20%'
          }
        },
        {
          key: 'availableAmount',
          label: this.$t('postings.table.available'),
          subLabel: this.$t('postings.table.limit'),
          sortField: 'availableAmount',
          isSort: true,
          thStyle: {
            width: '15%'
          }
        },
        {
          key: 'amount',
          label: this.$t('postings.table.total_trans'),
          subLabel: this.$t('postings.table.success_percent'),
          sortField: 'finishedAmount',
          isSort: true,
          thStyle: {
            width: '14%'
          }
        },
        {
          key: 'price',
          label: this.$t('postings.table.price_title'),
          subLabel: '',
          sortField: 'price',
          isSort: true,
          align: 'center',
          thStyle: {
            width: '12%'
          }
        },
        {
          key: 'operator',
          label: this.$t('postings.table.operator'),
          subLabel: '',
          sortField: '',
          isSort: false,
          align: 'center',
          thStyle: {
            width: '10.5%'
          }
        },
        {
          key: 'updatedAt',
          label: this.$t('postings.table.time_update'),
          subLabel: '',
          sortField: 'updatedAt',
          isSort: false,
          align: 'center',
          thStyle: {
            width: '9.8%'
          }
        },
        {
          key: 'status',
          label: this.$t('postings.table.status'),
          subLabel: '',
          sortField: 'status',
          isSort: true,
          align: 'center',
          thStyle: {
            width: '10%',
            minWidth: '100px'
          }
        },
        {
          key: 'action',
          label: this.$t('postings.table.action'),
          subLabel: '',
          sortField: '',
          align: 'center',
          isSort: false,
          thStyle: {
            width: '7%'
          }
        }
      ]
    }
  },
  computed: {
    ...mapState('merchant-posting', ['currentPosting']),
    queryParams () {
      return {
        page: this.page,
        limit: this.limit,
        status: this.status,
        ...(this.orderDirection && this.orderField) && { orderField: this.orderField },
        ...(this.orderDirection && this.orderField) && { orderDirection: this.orderDirection },
        ...(this.assetId) && { assetId: this.assetId },
        ...(this.postType) && { type: this.postType },
        ...(this.searchField) && { searchType: this.searchField },
        ...(this.searchValue) && { search: this.searchValue }
      }
    }
  },
  async created () {
    await this.getListPost()
  },
  methods: {
    ...mapActions('merchant-posting', ['onSetCurrentPost']),
    ...mapActions('modal-response', ['showResponseModal']),
    async handleChangeSort ({ sortField, sortDirection }) {
      this.page = 1
      this.orderField = sortField
      this.orderDirection = sortDirection
      await this.getListPost()
    },
    onOpenChangeStatusModal (item) {
      this.onSetCurrentPost({
        ...item,
        isClose: false,
        isShowInfo: true
      })
      this.$bvModal.show(MODAL.SET_POSTING_STATUS)
    },
    async onToggleStatusPosting () {
      try {
        this.onSetCurrentPost({
          ...this.currentPosting,
          isLoading: true
        })
        const { id, status } = this.currentPosting
        const data = await this.$axios.$put(MERCHANT_MANAGER_UPDATE_POST(id), {
          showAd: status === POST_STATUS_TYPE.ONLINE ? POST_STATUS.OFFLINE : POST_STATUS.ONLINE
        })
        if (data?.errors?.length) {
          this.handleError(data?.errors[0]?.key)
        }
        if (!data?.errors) {
          this.page = 1
          await this.getListPost()
        }
      } catch (error) {
        this.handleError(error?.response?.data?.errors?.[0]?.key)
      } finally {
        this.$bvModal.hide(MODAL.SET_POSTING_STATUS)
        this.onSetCurrentPost({
          ...this.currentPosting,
          isLoading: false
        })
      }
    },
    async handleChangePagination ({ page, limit }) {
      this.page = page
      this.limit = limit
      await this.getListPost()
    },
    async onFilterPosting (filterOptions) {
      this.assetId = filterOptions.assetId
      this.postType = filterOptions.postType
      this.searchField = filterOptions.searchField
      this.searchValue = filterOptions.searchValue
      this.status = filterOptions.status
      this.page = 1
      await this.getListPost()
    },
    async getListPost () {
      try {
        this.isLoading = true
        const { data } = await this.$axios.$get(MERCHANT_MANAGER_LIST_POST, { params: this.queryParams })
        this.postsListing = data?.items || []
        this.total = data?.totalItems || 0
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },
    handleError (key) {
      this.showResponseModal({
        title: '',
        content: this.$t('modal.message.merchant_postings_update_failed'),
        description: this.$t(`modal.message.${key || 'error_system'}`),
        icon: RESPONSE_ICON.POST_FAILED,
        show: true
      })
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/postings/index.scss" />
