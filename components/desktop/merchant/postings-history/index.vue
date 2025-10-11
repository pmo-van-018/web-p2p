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
      <p class="postings__title font-t20b grey-900 d-flex align-items-center">
        <span class="icon-chevron-right1" @click="$router.push('/merchant/postings')" /> {{ $t('postings_history.title') }}
      </p>
      <div class="postings__content">
        <posting-filter
          class="postings__filters"
          :is-history="true"
          :is-visible-date-picker="true"
          :is-visible-status="false"
          @on-filters="onFilterPosting"
        />
        <posting-table
          ref="postingTable"
          :is-history="true"
          :items="postsHistories"
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
                :id="'icon-document-copy'+item.id"
                class="icon-duplicated-plus"
                @click="handleClonePost(item.id)"
              >
                <span class="path1" /><span class="path2" /><span class="path3" />
              </span>
              <span
                :id="'icon-wallet-check'+item.id"
                class="icon-wallet-check"
                @click="$router.push(`/merchant/postings-history/${item.id}`)"
              >
              </span>
              <b-tooltip :target="'icon-wallet-check'+item.id" triggers="hover" placement="top">
                {{ $t("postings_history.post_item.view_matched_orders") }}
              </b-tooltip>
              <b-tooltip :target="'icon-document-copy'+item.id" triggers="hover" placement="top">
                {{ $t("postings_history.post_item.duplicate_order") }}
              </b-tooltip>
            </div>
          </template>
        </posting-table>
      </div>
    </client-only>
  </div>
</template>

<script>
import PostingFilter from '@/components/desktop/merchant/postings/posting-filter';
import postingCloneMixin from '@/mixins/merchant/posting-clone.js'
import PostingTable from '@/components/desktop/merchant/postings-history/posting-table';
import { mapActions, mapGetters, mapState } from 'vuex'
import { POST_STATUS } from '@/constants/posts'

export default {
  components: {
    PostingTable,
    PostingFilter,
    FilterLoaderSkeleton: () => import('~/components/desktop/commons/loader/filters.vue')
  },
  mixins: [postingCloneMixin],
  computed: {
    ...mapState('merchant-posting', ['total', 'limit', 'isLoading', 'page']),
    ...mapGetters('merchant-posting', ['postsHistories'])
  },
  async created () {
    this.onResetStateFilter()
    await this.updateMultiFilter({ orderField: 'updatedAt', status: POST_STATUS.CLOSED })
  },
  methods: {
    ...mapActions('merchant-posting', ['updateMultiFilter', 'onRefresh', 'onResetStateFilter']),
    async handleChangeSort (value) {
      const { sortDirection, sortField } = value
      await this.updateMultiFilter({ orderField: sortField, orderDirection: sortDirection, page: 1, status: POST_STATUS.CLOSED })
    },
    async handleChangePagination ({ limit, page }) {
      if (this.limit !== limit) {
        page = 1
      }
      await this.updateMultiFilter({ page, limit, status: POST_STATUS.CLOSED })
    },
    async onFilterPosting (filterOptions) {
      this.page = 1
      await this.updateMultiFilter({ ...filterOptions, status: POST_STATUS.CLOSED })
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/postings-history/index.scss" />
