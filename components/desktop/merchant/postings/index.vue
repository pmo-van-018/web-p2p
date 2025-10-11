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
      <p class="postings__title font-t20b grey-900">{{ $t('postings.title') }}</p>
      <div class="postings__content">
        <div class="postings__head">
          <posting-filter
            is-visible-date-picker
            :loading="isLoading"
            @on-filters="onFilterPosting"
            @on-refresh="onRefresh"
          />
        </div>
        <posting-table
          ref="postingTable"
          :items="postsListing"
          :page="page"
          :limit="limit"
          :total="total"
          :is-loading="isLoading"
          @change-sort="handleChangeSort"
          @change-pagination="handleChangePagination"
        >
          <template v-slot:action="{ item }">
            <div class="posting-item actions">
              <span
                :id="'post-icon-eye-slash' + item.id"
                class="icon-eye-slash"
                :class="`${item.status?.toLowerCase()}-status`"
                @click="showModalToggleDisplay(item)"
              />
              <span
                :id="'post-icon-edit' + item.id"
                class="icon-edit"
                @click="onEdit(item.id)"
              />

              <span
                :id="'post-icon-trash' + item.id"
                class="icon-close"
                @click="onClosePost(item.id)"
              >
              </span>
              <span
                :id="'post-icon-copy' + item.id"
                class="icon-duplicated-plus"
                @click="handleClonePost(item.id)"
              >
              </span>
              <b-tooltip :target="'post-icon-edit' + item.id" triggers="hover" placement="top">
                {{ $t('postings.post_item.edit') }}
              </b-tooltip>
              <b-tooltip :target="'post-icon-trash' + item.id" triggers="hover" placement="top">
                {{ $t('postings.post_item.delete') }}
              </b-tooltip>
              <b-tooltip :target="'post-icon-eye-slash' + item.id" triggers="hover" placement="top">
                {{ statusText(item.status) }}
              </b-tooltip>
              <b-tooltip :target="'post-icon-copy' + item.id" triggers="hover" placement="top">
                {{ $t('postings.post_item.clone') }}
              </b-tooltip>
            </div>
          </template>
        </posting-table>
        <modal-set-posting-status
          @handle-click="onToggleStatusPosting"
        />
      </div>
    </client-only>
  </div>
</template>

<script>
import PostingFilter from '@/components/desktop/merchant/postings/posting-filter';
import { mapActions, mapGetters, mapState } from 'vuex'
import postingCloneMixin from '@/mixins/merchant/posting-clone.js'
import { STATUS_AVAILABLE_FILTER } from '@/resources/postings-management';
import postingListing from '~/mixins/merchant/posting-listing'

export default {
  components: {
    PostingTable: () => import('~/components/desktop/merchant/postings/posting-table'),
    PostingFilter,
    ModalSetPostingStatus: () => import('~/components/common/modal/modal-set-posting-status.vue'),
    FilterLoaderSkeleton: () => import('~/components/desktop/commons/loader/filters.vue')
  },
  mixins: [postingListing, postingCloneMixin],
  computed: {
    ...mapState('merchant-posting', ['total', 'limit', 'isLoading', 'page']),
    ...mapGetters('merchant-posting', ['postsListing'])
  },
  async created () {
    this.onResetStateFilter()
    await this.updateMultiFilter({
      orderField: 'createdAt',
      status: STATUS_AVAILABLE_FILTER
    })
  },
  methods: {
    ...mapActions('merchant-posting', ['updateMultiFilter', 'onRefresh', 'onResetStateFilter']),
    async handleChangeSort (value) {
      const { sortDirection, sortField } = value
      await this.updateMultiFilter({ orderField: sortField, orderDirection: sortDirection, page: 1 })
    },
    async handleChangePagination ({ page, limit }) {
      await this.updateMultiFilter({ page, limit })
    },
    async onFilterPosting (filterOptions) {
      this.page = 1
      await this.updateMultiFilter(filterOptions)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/postings/index.scss" />
