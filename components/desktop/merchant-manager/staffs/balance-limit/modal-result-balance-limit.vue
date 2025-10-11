<template>
  <b-modal
    :id="modalId"
    modal-class="modal-custom bottom modal-balance"
    centered
    hide-header
    hide-footer
    @show="onShowModal"
  >
    <div class="balance-limit">
      <div class="balance-limit__container">
        <div class="balance-limit__header">
          <div class="balance-limit__header-wrapper">
            <div class="balance-limit__header-inner">
              <div class="balance-limit__title balance-limit__title--large">
                {{ $t('modal.title.system') }}
              </div>
            </div>
          </div>
          <div class="balance-limit__close" @click="onCloseModal">
            <span class="icon-cancel" />
          </div>
        </div>
        <template v-if="isShowConfirmSubmitBalance">
          <div class="balance-limit__thumb">
            <img src="/assets/images/common/balance-limit/question.svg" alt="icon question">
          </div>
          <div class="balance-limit__content">
            {{ $t('balance_limit.are_you_sure') }}
          </div>
        </template>
        <template v-else>
          <div class="balance-limit__thumb">
            <img src="/assets/images/common/balance-limit/succeed.svg" alt="icon succeed">
          </div>
          <div class="balance-limit__succeed-title">
            {{ $t('balance_limit.title_succeed') }}
          </div>
          <div class="balance-limit__content">
            {{ $t('balance_limit.content_succeed') }}
          </div>
          <div v-if="isLoading" class="balance-limit__loading">
            <b-skeleton-table
              :rows="5"
              :columns="2"
              :table-props="{ bordered: true, striped: true }"
            />
          </div>
          <div v-else-if="balanceConfigs.length && !isLoading" class="balance-limit__body mt-3">
            <div class="balance-limit__list">
              <asset-balance :balance-configs="balanceConfigs" :is-show-input="false" />
            </div>
          </div>
        </template>
        <div class="balance-limit__action">
          <base-button
            variants="contained"
            color="primary"
            full-width
            :loading="isLoading"
            @click="onConfirmSubmitBalance"
          >
            {{ $t('action.confirm') }}
          </base-button>
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
      modalId: MODAL.SETTING_RESULT_LIMIT_BALANCE,
      isShowConfirmSubmitBalance: true
    }
  },
  watch: {
    isLoading: {
      handler (value) {
        this.isShowConfirmSubmitBalance = value
      }
    }
  },
  methods: {
    onConfirmSubmitBalance () {
      if (!this.isShowConfirmSubmitBalance) {
        this.$bvModal.hide(this.modalId)
        return
      }
      this.$emit('on-update-balance')
    },
    onCloseModal () {
      this.$bvModal.hide(this.modalId)
    },
    onShowModal () {
      this.isShowConfirmSubmitBalance = true
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/role-management/balance-limit.scss">
</style>
