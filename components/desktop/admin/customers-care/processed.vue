<template>
  <section class="management-wrapper">
    <div class="management-wrapper__container">
      <div class="management-wrapper__head">
        <template v-if="isSkeletonLoading">
          <filter-loader-skeleton class="delay-animation" />
        </template>
        <template v-else>
          <filter-head-table
            is-visible-search
            is-visible-topic
            :loading="requestLoading"
            :is-visible-state="false"
            @on-filters="$completedRequestMixin_handleFilter"
            @on-refresh="$commonRequestSupportMixin_onRefresh"
            @on-search="$commonRequestSupportMixin_onSearch"
          />
        </template>
      </div>
      <div class="management-wrapper__body">
        <template v-if="isSkeletonLoading">
          <b-skeleton-table
            class="delay-animation"
            :rows="7"
            :columns="4"
            :table-props="{ bordered: false, striped: false }"
          />
        </template>
        <template v-else>
          <order-table
            custom-class="order-table__variant"
            :items="items"
            :fields="fieldsMapped"
            :page="page"
            :limit="limit"
            :total="total"
            :is-loading="requestLoading"
            @change-sort="$commonRequestSupportMixin_handleChangeSort"
            @change-pagination="$commonRequestSupportMixin_onChangePage"
          >
            <template #cell(userRequest)="{ item }">
              <div class="management-wrapper__text mb-1">
                {{ item.userName || '' }}
              </div>
              <status :status="item.online" />
            </template>
            <template #cell(timeRequest)="{ item }">
              <div class="management-wrapper__text d-inline-block">
                {{ item.createdAt | formatDateTime }}
              </div>
            </template>
            <template #cell(refId)="{ item }">
              <div class="management-wrapper__text">
                #{{ item.id }}
              </div>
            </template>
            <template #cell(topic)="{ item }">
              <type-support-request :item="item" />
            </template>
            <template v-if="isSupperAdmin" #cell(adminName)="{ item }">
              <div class="d-flex justify-content-center management-wrapper__text">
                {{ item.adminName }}
              </div>
            </template>
            <template #cell(timeProcess)="{ item }">
              <div class="management-wrapper__text d-inline-block">
                {{ item.completedAt | formatDateTime }}
              </div>
            </template>
            <template #cell(actions)="{ item }">
              <div class="d-flex justify-content-center">
                <base-button
                  variants="text"
                  class="management-wrapper__action-message"
                  @click="$commonRequestSupportMixin_onOpenDetailRequest(item)"
                >
                  <svg-icon
                    v-b-tooltip="{
                      trigger: $device.isMobile ? 'focus' : 'hover',
                      disabled: $device.isMobile
                    }"
                    icon="read-message"
                    :title="$t('common.tooltip.view_message')"
                    class="management-wrapper__message-icon"
                  />
                </base-button>
              </div>
            </template>
          </order-table>
        </template>
      </div>
    </div>
  </section>
</template>
<script>
import { mapState } from 'vuex';
import { USER_ROLE } from '@/config/constant'
import modalMixin from '~/mixins/modal'
import completedCustomerCareMixin from '~/mixins/admin-supporter/customers-care/completed.js'

export default {
  components: {
    OrderTable: () => import('~/components/desktop/orders/table/index.vue'),
    FilterLoaderSkeleton: () => import('~/components/desktop/commons/loader/filters.vue'),
    Status: () => import('~/components/common/customer-care/status.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    TypeSupportRequest: () => import('~/components/common/customer-care/type-support.vue'),
    FilterHeadTable: () => import('~/components/desktop/admin/customers-care/filters/index.vue'),
    SvgIcon: () => import('~/components/common/svg-icon/index.vue')
  },
  mixins: [modalMixin, completedCustomerCareMixin],
  computed: {
    ...mapState('user', ['user']),
    isSupperAdmin () {
      return this.user?.type === USER_ROLE.SUPER_ADMIN
    }
  },
  async created () {
    await this.$completedRequestMixin_onResetFilter().then(() => {
      setTimeout(() => {
        this.isSkeletonLoading = false
      }, 600)
    })
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/admin/customer-care/list.scss">
</style>
