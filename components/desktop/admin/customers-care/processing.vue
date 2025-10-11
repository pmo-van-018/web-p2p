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
            @on-filters="$processingRequestMixin_handleFilter"
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
            :items="supportRequests"
            :fields="fields"
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
                    :icon="item?.isSeenMessage ? 'read-message' : 'unread-message'"
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
import { mapActions } from 'vuex'
import modalMixin from '~/mixins/modal'
import processingCustomerCareMixin from '~/mixins/admin-supporter/customers-care/processing.js'
import listSocketMixin from '~/mixins/admin-supporter/customers-care/list-socket.js'

export default {
  components: {
    OrderTable: () => import('~/components/desktop/orders/table/index.vue'),
    FilterLoaderSkeleton: () => import('~/components/desktop/commons/loader/filters.vue'),
    Status: () => import('~/components/common/customer-care/status.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    TypeSupportRequest: () => import('~/components/common/customer-care/type-support.vue'),
    FilterHeadTable: () => import('~/components/desktop/admin/customers-care/filters/index.vue'),
    SvgIcon: () => import('~/components/common/svg-icon/index.vue'),
    StatusText: () => import('~/components/common/customer-care/status-text.vue')
  },
  mixins: [modalMixin, processingCustomerCareMixin, listSocketMixin],
  async created () {
    await this.$processingRequestMixin_onResetFilter().then(() => {
      setTimeout(() => {
        this.isSkeletonLoading = false
      }, 600)
    })
    if (this.roomIds.length) {
      await this.getLastMessages(this.roomIds)
      this.initSocketList(this.roomIds)
    }
  },
  beforeDestroy () {
    if (this.roomIds.length) {
      this.leaveRoomSocketList(this.roomIds)
    }
    this.resetStateChat()
  },
  methods: {
    ...mapActions('chat-support-request', ['getLastMessages', 'resetStateChat'])
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/admin/customer-care/list.scss">
</style>
