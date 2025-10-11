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
            :loading="requestLoading"
            :is-visible-step="isSupperAdmin"
            @on-filters="$pendingRequestMixin_handleFilter"
            @on-refresh="$commonRequestSupportMixin_onRefresh"
            @on-search="$commonRequestSupportMixin_onSearch"
          />
        </template>
        <div v-if="!isSupperAdmin" class="management-wrapper__total-processing">
          {{ $t('customer_care.number_has_received') }}: <strong>{{ totalPicked }}/{{ limitReceived }}</strong>
        </div>
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
              <div :id="'created-at' + item.createdAt" class="management-wrapper__text d-inline-block">
                {{ item.createdAt | diffForHumans }}
              </div>
              <b-tooltip :target="'created-at' + item.createdAt" triggers="hover" placement="top">
                {{ formatDateTime(item.createdAt) }}
              </b-tooltip>
            </template>
            <template #cell(refId)="{ item }">
              <div class="management-wrapper__text">
                #{{ item.id }}
              </div>
            </template>
            <template #cell(topic)="{ item }">
              <type-support-request :item="item" />
            </template>
            <template #cell(status)="{ item }">
              <status-text :item="item" />
            </template>
            <template v-if="isSupperAdmin" #cell(adminName)="{ item }">
              <div v-if="item.adminName" class="d-flex justify-content-center management-wrapper__text">
                {{ item.adminName }}
              </div>
              <div v-else class="d-flex align-items-center justify-content-center">
                <svg>
                  <use xlink:href="#icon-pending" />
                </svg>
                <span class="font-t12r grey-400 ml-2">{{ $t('customer_care.pending') }}</span>
              </div>
            </template>
            <template #cell(actions)="{ item }">
              <div class="d-flex justify-content-center">
                <base-button
                  variants="contained"
                  color="primary"
                  :loading="item._loadingButton"
                  :disabled="item._loadingButton"
                  @click="$pendingRequestMixin_onReceivedSupportRequest(item)"
                >
                  {{ $t('action.received_support') }}
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
import pendingCustomerCareMixin from '~/mixins/admin-supporter/customers-care/pending.js'

export default {
  components: {
    OrderTable: () => import('~/components/desktop/orders/table/index.vue'),
    FilterLoaderSkeleton: () => import('~/components/desktop/commons/loader/filters.vue'),
    Status: () => import('~/components/common/customer-care/status.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    TypeSupportRequest: () => import('~/components/common/customer-care/type-support.vue'),
    FilterHeadTable: () => import('~/components/desktop/admin/customers-care/filters/index.vue'),
    StatusText: () => import('~/components/common/customer-care/status-text.vue')
  },
  mixins: [modalMixin, pendingCustomerCareMixin],
  computed: {
    ...mapState('user', ['user']),
    isSupperAdmin () {
      return this.user?.type === USER_ROLE.SUPER_ADMIN
    }
  },
  created () {
    this.$pendingRequestMixin_onResetFilter().then(() => {
      setTimeout(() => {
        this.isSkeletonLoading = false
      }, 600)
    })
    if (!this.isSupperAdmin) {
      this.$pendingRequestMixin_getCountSupportRequest()
      this.$pendingRequestMixin_getRequestReceiveLimit()
    }
    this.$commonRequestSupportMixin_countListSupportRequestsPending()
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/admin/customer-care/list.scss">
</style>
