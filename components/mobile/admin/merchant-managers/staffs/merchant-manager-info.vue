<template>
  <div class="merchant-manager-info">
    <div class="merchant-manager-info__item">
      <span class="merchant-manager-info__label">{{ $t('role_management.label.wallet_address') }}</span>
      <span class="merchant-manager-info__value wallet-address">
        <span class="name">{{ merchantManager?.walletAddress | formatHash }}</span>

        <copy-button
          :id="`wallet-address-copy-${merchantManager?.id}`"
          :value="merchantManager?.walletAddress"
          :text-guide="$t('role_management.label.copy_wallet_address')"
        />
      </span>
    </div>

    <div class="merchant-manager-info__item">
      <span class="merchant-manager-info__label">{{ $t('role_management.label.number_members') }}</span>
      <span class="merchant-manager-info__value">{{ merchantManager?.registeredMembers }}</span>
    </div>

    <div class="merchant-manager-info__item">
      <span class="merchant-manager-info__label">{{ $t('role_management.label.contract_from') }}</span>
      <span class="merchant-manager-info__value">
        {{ merchantManager?.contractFrom | formatDateTime(DATE_FORMAT) }}
      </span>
    </div>

    <div class="merchant-manager-info__item">
      <span class="merchant-manager-info__label">{{ $t('role_management.label.time_create') }}</span>
      <span class="merchant-manager-info__value">
        {{ merchantManager?.createdAt | formatDateTime }}
      </span>
    </div>

    <div class="merchant-manager-info__item">
      <span class="merchant-manager-info__label">{{ $t('role_management.label.time_update') }}</span>
      <span class="merchant-manager-info__value">
        {{ merchantManager?.updatedAt | formatDateTime }}
      </span>
    </div>

    <div class="merchant-manager-info__item">
      <span class="merchant-manager-info__label">{{ $t('role_management.label.status') }}</span>
      <div class="merchant-manager-info__value status-box">
        <switch-checkbox :value="statusAsBoolean" @click="handleClickStatus" />
        <span class="status-box__text ml-2 font-t12m grey-400" :class="status?.className">
          {{ status?.text }}
        </span>
      </div>
    </div>

    <ModalConfirmChangeStatus
      :postfix="postfix"
      :title-active="this.$t('merchant_managers.change_status.title_active')"
      :title-inactive="this.$t('merchant_managers.change_status.title_inactive')"
      :description-active="this.$t('merchant_managers.change_status.description_active')"
      :description-inactive="this.$t('merchant_managers.change_status.description_inactive')"
      :is-confirm-active="!statusAsBoolean"
      @on-confirm="handleConfirmChangeStatus"
      @on-cancel="handleCancelChangeStatus"
    />

    <ModalSuccessResult
      is-show-contract-from
      :postfix="postfix"
      :title="$t('merchant_managers.form_edit.title_success')"
      :description="$t('merchant_managers.form_edit.description_success')"
      :user="successfulResult"
      @on-close="$emit('on-success-update')"
    />

    <ModalFailureResult
      is-show-old-user
      is-show-contract-from
      :postfix="postfix"
      :title="$t('merchant_managers.form_edit.title_failure')"
      :default-description="$t('merchant_managers.form_edit.description_failure')"
      :error-result="errorResult"
      :user="merchantManager"
    />
  </div>
</template>

<script>
import merchantManagerInfoMixin from '@/mixins/admin/merchant-manager-info';
import { DATE_FORMAT, DATE_TIME_FORMAT } from '@/config/constant';

export default {
  components: {
    CopyButton: () => import('~/components/common/copy-button.vue'),
    SwitchCheckbox: () => import('~/components/common/forms/switch-checkbox/index.vue'),
    ModalConfirmChangeStatus: () => import('~/components/common/role-management/modal-confirm-change-status.vue'),
    ModalSuccessResult: () => import('~/components/common/role-management/modal-success.vue'),
    ModalFailureResult: () => import('~/components/common/role-management/modal-failure.vue')
  },
  mixins: [merchantManagerInfoMixin],
  data () {
    return {
      DATE_TIME_FORMAT,
      DATE_FORMAT
    };
  }
}
</script>

<style lang="scss" scoped src="static/assets/scss/components/mobile/admin/staffs/merchant-manager-info.scss" />
