<template>
  <div class="list-wallets h-100">
    <div class="list-wallets__container h-100">
      <div class="list-wallets__head">
        <div v-for="(field, index) in fields" :key="`list-${index}`" class="list-wallets__head-inner">
          <div class="list-wallets__title">{{ field.title }}</div>
        </div>
      </div>
      <div v-if="hasWalletAddress" class="list-wallets__body">
        <div v-for="item in walletAddresses" :key="item.walletAddress" class="list-wallets__body-inner">
          <div class="wallet-item">
            <div class="wallet-item__inner">
              <div class="wallet-item__item">
                <div class="wallet-item__wallet-address">
                  <span class="wallet-item__wallet-address-text">{{ item.walletAddress }}</span>
                  <copy-button
                    :id="`support-${item.walletAddress}`"
                    :show-text-copied="false"
                    :value="item.walletAddress"
                  />
                </div>
              </div>
              <div class="wallet-item__item">
                <div class="current-status" :class="{active: isStatusActive(item.status)}">
                  <div class="current-status__inner">
                    <span class="current-status__dot" />
                    <span class="current-status__text">
                      {{ statusText(item.status) }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="wallet-item__item">
                <div class="wallet-action">
                  <div class="wallet-action__switch">
                    <switch-checkbox
                      :value="isStatusActive(item.status)"
                      :disabled="isStatusActive(item.status)"
                      @click="onChangeStatusMerchantManager($event, item)"
                    />
                  </div>
                  <div :id="'wallet' + item.walletAddressId" class="wallet-action__delete">
                    <base-button
                      variants="text"
                      :disabled="isStatusActive(item.status)"
                      @click="onOpenConfirmDeleteMerchantManager($event, item)"
                    >
                      <span class="icon-trash" />
                    </base-button>
                  </div>
                  <b-tooltip
                    :disabled="isStatusActive(item.status)"
                    :target="'wallet' + item.walletAddressId"
                    triggers="hover"
                    placement="top"
                  >
                    {{ $t('role_management.delete_wallet_address_title') }}
                  </b-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="hasLoading" class="list-wallets__empty h-100">
        <loader />
      </div>
      <div v-else class="list-wallets__empty h-100">
        <empty-data />
      </div>
    </div>
    <client-only>
      <modal-action
        :modal-id="statusModalId"
        :is-loading="isUpdateWalletAddressLoading"
        :title="$t('role_management.active_wallet_address_title')"
        :icon="require('~imageRoot/common/wallets/active-wallet.svg')"
        @on-submit-action="onUpdateStatusWalletAddress"
      >
        <div class="font-t16r grey-900 text-center">
          <p class="m-0 p-0" v-html="notifyActive" />
          <p class="m-0 p-0">{{ $t('role_management.message.continue') }}</p>
        </div>
      </modal-action>
      <modal-action
        :modal-id="deleteModalId"
        :is-loading="isDeleteWalletAddressLoading"
        :icon="require('~imageRoot/common/wallets/delete-wallet.svg')"
        :title="$t('role_management.delete_wallet_address_title')"
        @on-submit-action="onDeleteWalletAddress"
      >
        <div class="font-t16r grey-900 text-center">
          {{ $t('role_management.message.are_you_delete') }}
        </div>
      </modal-action>
    </client-only>
  </div>
</template>
<script>
import { USER_ROLE, USER_STATUS } from '@/config/constant';
import { MODAL } from '@/resources/modal';
import {
  ACTIVE_WALLET_ADDRESS_BY_ID,
  DELETE_WALLET_ADDRESS_BY_ID,
  ADMIN_ACTIVE_WALLET_ADDRESS_BY_ID,
  ADMIN_DELETE_WALLET_ADDRESS_BY_ID
} from '@/api/wallet-address';
import { mapActions, mapState } from 'vuex';
import isEmpty from 'lodash/isEmpty';
import { CONFIRM_TYPE, RESPONSE_ICON } from '@/resources/message';

export default {
  components: {
    CopyButton: () => import('~/components/common/copy-button.vue'),
    SwitchCheckbox: () => import('~/components/common/forms/switch-checkbox/index.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    EmptyData: () => import('~/components/desktop/commons/tables/empty-data.vue'),
    Loader: () => import('~/components/common/loader.vue'),
    ModalAction: () => import('~/components/desktop/merchant-manager/wallet-addresses/modal-action.vue')
  },
  props: {
    walletAddresses: {
      type: Array,
      default: () => []
    },
    nickname: {
      type: String,
      default: ''
    },
    managerId: {
      type: String,
      default: ''
    },
    isListLoading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      profileInformationSelected: null,
      statusAsBoolean: false,
      isDeleteWalletAddressLoading: false,
      isUpdateWalletAddressLoading: false,
      fields: [
        {
          title: this.$t('role_management.label.wallet_address')
        },
        {
          title: this.$t('role_management.label.status_wallet_address')
        },
        {
          title: this.$t('role_management.label.action')
        }
      ]
    }
  },
  computed: {
    ...mapState('user', ['user']),
    hasWalletAddress () {
      return this.walletAddresses.length && !this.isListLoading
    },
    hasLoading () {
      return this.isListLoading
    },
    postfix () {
      return `_wallet_${this.profileInformationSelected?.id || ''}`;
    },
    notifyActive () {
      return this.$t('role_management.message.notify_active', { name: this.nickname })
    },
    statusModalId () {
      return `status_${MODAL.CHANGE_STATUS_WALLET_ADDRESS}${this.postfix}`
    },
    deleteModalId () {
      return `delete_${MODAL.CHANGE_STATUS_WALLET_ADDRESS}${this.postfix}`
    },
    isRoleMerchantManager () {
      return this.user?.type === USER_ROLE.MERCHANT_MANAGER
    }
  },
  methods: {
    ...mapActions('modal-response', ['showResponseModal']),
    statusText (status) {
      return status === USER_STATUS.ACTIVE ? this.$t('role_management.used') : this.$t('role_management.unused')
    },
    isStatusActive (status) {
      return status === USER_STATUS.ACTIVE
    },
    onChangeStatusMerchantManager (status, profileInformationSelected) {
      if (this.isStatusActive(profileInformationSelected.status)) {
        return;
      }
      this.profileInformationSelected = profileInformationSelected
      this.$bvModal.show(this.statusModalId)
    },
    onOpenConfirmDeleteMerchantManager (status, profileInformationSelected) {
      if (this.isStatusActive(profileInformationSelected.status)) {
        return;
      }
      this.profileInformationSelected = profileInformationSelected
      this.$bvModal.show(this.deleteModalId)
    },
    async onUpdateStatusWalletAddress () {
      try {
        this.isUpdateWalletAddressLoading = true
        let result;
        if (this.isRoleMerchantManager) {
          result = await this.$axios.$put(ACTIVE_WALLET_ADDRESS_BY_ID?.(this.profileInformationSelected?.walletAddressId))
        } else {
          result = await this.$axios.$put(ADMIN_ACTIVE_WALLET_ADDRESS_BY_ID?.(this.profileInformationSelected?.walletAddressId), {
            managerId: this.managerId
          })
        }
        if (result?.errors?.length) {
          this.handleError(result?.errors[0].key)
        }
        this.$emit('on-update-active-wallet')
      } catch (error) {
        const errorKey = error.response?.data?.errors[0]?.key || 'error_system'
        this.handleError(errorKey)
      } finally {
        this.isUpdateWalletAddressLoading = false
        this.$bvModal.hide(this.statusModalId)
      }
    },
    handleError (errorKey) {
      if (errorKey === 'MANAGER_HAS_PENDING_ORDER') {
        this.showResponseModal({
          title: this.$t('modal.title.warning_system'),
          description: this.$t(`modal.message.${errorKey}`),
          icon: RESPONSE_ICON.NOT_ALLOWED_ACTIVE_WALLET_ADDRESS,
          confirmAction: this.$t('action.confirm'),
          confirmActionType: CONFIRM_TYPE.CLOSE,
          show: true
        });
        return
      }

      this.showResponseModal({
        title: this.$t('merchant_managers.form_edit.title_failure'),
        icon: RESPONSE_ICON.UPDATE_WALLET_FAILED,
        description: '',
        content: '',
        show: true
      });
    },
    async onDeleteWalletAddress () {
      try {
        this.isDeleteWalletAddressLoading = true
        let result;
        if (this.isRoleMerchantManager) {
          result = await this.$axios.$delete(DELETE_WALLET_ADDRESS_BY_ID?.(this.profileInformationSelected?.walletAddressId))
        } else {
          result = await this.$axios.$put(ADMIN_DELETE_WALLET_ADDRESS_BY_ID?.(this.profileInformationSelected?.walletAddressId), {
            managerId: this.managerId
          })
        }
        if (isEmpty(result?.errors)) {
          this.showResponseModal({
            title: this.$t('merchant_managers.wallet_address.delete_wallet_succeed'),
            icon: RESPONSE_ICON.DELETE_WALLET_SUCCEED,
            description: '',
            content: '',
            type: 'success',
            show: true
          });
          this.$emit('on-refresh-wallet')
        }
      } catch (error) {
        this.showResponseModal({
          title: this.$t('merchant_managers.wallet_address.delete_wallet_failed'),
          icon: RESPONSE_ICON.DELETE_WALLET_FAILED,
          description: '',
          content: '',
          show: true
        });
      } finally {
        this.isDeleteWalletAddressLoading = false
        this.$bvModal.hide(this.deleteModalId)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.list-wallets {
  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    padding-bottom: 24px;
  }
  &__head-inner {
    width: 20%;
    &:first-child {
      width: 60%;
    }
    &:last-child {
      width: 20%;
      text-align: center;
    }
  }
  &__title {
    color: $grey-400;
    @include font-t12m;
  }
  &__body {
    @include scrollbars(3px, $grey-200, $white);
    overflow: auto;
    max-height: 400px;
    display: flex;
    flex-direction: column;
    gap: 11px;
    padding-right: 12px;
  }
  &__empty {
    display: grid;
    place-content: center;
  }
  &__body-inner {
    padding: 1rem 0;
  }
}
.wallet-item {
  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
  }
  &__item {
    width: 20%;
    &:first-child {
      width: 60%;
    }
    &:last-child {
      width: 20%;
    }
  }
  &__wallet-address {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  &__wallet-address-text {
    @include font-t16m;
    color: $grey-900;
    font-size: calc(clamp(14px, 1.1vw, 16px));
  }
}
.current-status {
  background-color: $grey-100;
  border-radius: 4px;
  max-width: 126px;
  padding: 3px;
  &__inner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }
  &__dot {
    border-radius: 100px;
    width: 7px;
    height: 7px;
    background-color: $grey-500;
  }
  &__text {
    @include font-t12m;
    line-height: 20px;
    color: $grey-500;
  }
  &.active {
    background-color: #E6F6EE;
    .current-status {
      &__dot {
        background-color: $green-500;
      }
      &__text {
        color: $green-500;
      }
    }
  }
}
.wallet-action {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: flex-end;
  @media (min-width: 1600px) {
    gap: 46px;
  }
  &__switch {
    &.disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }
  &__delete {
    display: flex;
    align-items: center;
    .base-button {
      padding: 0;
      min-width: auto;
      &:disabled {
        background: transparent;
        opacity: 0.3;
      }
    }
    .icon-trash {
      font-size: 24px;
    }
  }
}
</style>
