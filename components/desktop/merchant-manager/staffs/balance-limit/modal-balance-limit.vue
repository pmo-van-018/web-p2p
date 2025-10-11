<template>
  <b-modal
    :id="modalId"
    modal-class="modal-custom bottom modal-balance"
    centered
    hide-header
    hide-footer
    @show="$emit('on-show')"
    @hide="onCloseModal"
  >
    <div class="balance-limit">
      <div class="balance-limit__container">
        <div class="balance-limit__header">
          <div class="balance-limit__header-wrapper">
            <div class="balance-limit__header-inner">
              <div class="balance-limit__icon">
                <img src="/assets/images/common/icon-charge.svg" alt="icon charge">
              </div>
              <div class="balance-limit__title">
                {{ $t('balance_limit.title') }}
              </div>
            </div>
            <p class="balance-limit__desc">{{ $t('balance_limit.desc') }}</p>
          </div>
          <div class="balance-limit__close" @click="onCloseModal">
            <span class="icon-cancel" />
          </div>
        </div>
        <div v-if="isLoading" class="balance-limit__loading">
          <b-skeleton-table
            :rows="5"
            :columns="2"
            :table-props="{ bordered: true, striped: true }"
          />
        </div>
        <div v-else class="balance-limit__body">
          <div class="balance-limit__list">
            <asset-balance :balance-configs="balanceConfigs" />
          </div>
          <div class="balance-limit__action">
            <base-button
              variants="contained"
              color="primary"
              full-width
              @click="onConfirm"
            >
              {{ $t('common.apply') }}
            </base-button>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>
<script>
import { MODAL } from '@/resources/modal';

export default {
  components: {
    BaseButton: () => import('@/components/common/base-button/index.vue'),
    AssetBalance: () => import('@/components/desktop/merchant-manager/staffs/balance-limit/asset-balance.vue')
  },
  props: {
    balanceConfigs: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      modalId: MODAL.SETTING_LIMIT_BALANCE
    }
  },
  methods: {
    onCloseModal () {
      this.$bvModal.hide(this.modalId)
    },
    onConfirm () {
      this.$emit('on-confirm-submit', this.balanceConfigs)
      this.$bvModal.hide(this.modalId)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/role-management/balance-limit.scss">
</style>
