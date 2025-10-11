<template>
  <client-only>
    <div class="role-management">
      <div class="role-management__heading">
        <div class="d-flex justify-content-between align-items-end">
          <div class="d-flex flex-column">
            <p class="role-management__title">{{ $t('news.title') }}</p>
            <p class="role-management__description">{{ $t('news.description') }}</p>
          </div>
          <base-button variants="outlined" color="primary" @click="onCreateNew">
            {{ $t('action.add_new') }}
          </base-button>
        </div>
      </div>
      <div class="role-management__content">
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
              <news-table
                ref="newsTables"
                :items="items"
                :is-loading="isLoading"
                @get-list="getNews"
              />
            </template>
          </b-skeleton-wrapper>
        </div>
      </div>
      <modal-add-news-list @on-refresh="getNews" />
    </div>
  </client-only>
</template>

<script>
import { MODAL } from '@/resources/modal';
import { ADMIN_NEW_API } from '@/api/new';

export default {
  components: {
    NewsTable: () => import('~/components/desktop/admin/news/table.vue'),
    ModalAddNewsList: () => import('~/components/desktop/admin/news/modal-add.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  data () {
    return {
      isSkeletonLoading: true,
      isLoading: false,
      items: []
    };
  },
  async created () {
    await this.getNews();
    setTimeout(() => {
      this.isSkeletonLoading = false;
    }, 1000);
  },
  methods: {
    async getNews () {
      try {
        this.isLoading = true
        const { data } = await this.$axios.$get(ADMIN_NEW_API.LIST)
        this.items = data?.items || []
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },
    onCreateNew () {
      this.$bvModal.show(MODAL.ADD_NEWS)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/role-management/index.scss" />
