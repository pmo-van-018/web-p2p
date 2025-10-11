<template>
  <div class="wallet-addresses">
    <div class="wallet-addresses__wrapper">
      <loader-skeleton v-if="isFirstLoading" />
      <template v-else-if="isActive && !isFirstLoading">
        <div class="wallet-addresses__note">
          <div class="wallet-addresses__note-title">
            <span class="icon-question" />
            <span>{{ $t('role_management.interested') }}:</span>
          </div>
          <ul class="wallet-addresses__note-list">
            <li class="wallet-addresses__note-item">{{ $t('role_management.note_wallet_address.first') }}</li>
            <li class="wallet-addresses__note-item">{{ $t('role_management.note_wallet_address.second') }}</li>
          </ul>
        </div>
        <div class="wallet-addresses__container">
          <div class="wallet-addresses__inner">
            <current-wallet-address :wallet-address="walletAddress" />
          </div>
          <div class="wallet-addresses__inner">
            <wrapper-list-wallet-addresses
              :wallet-addresses="walletAddresses"
              :nickname="nickName"
              :manager-id="managerId"
              :is-list-loading="isListLoading"
              @on-refresh-wallet="$emit('on-refresh-wallet')"
              @on-update-active-wallet="$emit('on-update-active-wallet')"
            />
          </div>
        </div>
      </template>
      <div v-else class="wallet-addresses__empty">
        <empty-data>{{ $t('role_management.inactive_content') }}</empty-data>
      </div>
    </div>
  </div>
</template>
<script>
import { USER_STATUS } from '@/config/constant';

export default {
  components: {
    CurrentWalletAddress: () => import('~/components/desktop/merchant-manager/wallet-addresses/current-wallet-address.vue'),
    WrapperListWalletAddresses: () => import('~/components/desktop/merchant-manager/wallet-addresses/wrapper-list.vue'),
    EmptyData: () => import('~/components/desktop/commons/tables/empty-data.vue'),
    LoaderSkeleton: () => import('~/components/desktop/merchant-manager/wallet-addresses/loader.vue')
  },
  props: {
    profileInformation: {
      type: Object,
      default: () => {}
    },
    walletAddresses: {
      type: Array,
      default: () => []
    },
    isListLoading: {
      type: Boolean,
      default: false
    },
    isFirstLoading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    walletAddress () {
      return this.profileInformation?.walletAddress || ''
    },
    managerId () {
      return this.profileInformation?.id || ''
    },
    nickName () {
      return this.profileInformation?.nickName || ''
    },
    isActive () {
      return this.profileInformation?.status === USER_STATUS.ACTIVE
    }
  }
}
</script>
<style lang="scss" scoped>
.wallet-addresses {
  &__container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    @media (min-width: 1300px) {
      flex-direction: row;
    }
    @media (min-width: 1600px) {
      gap: 2rem;
    }
  }
  &__note {
    padding: 12px;
    background-color: $neutrals-10;
    border-radius: 8px;
    margin-bottom: 1.5rem;
  }
  &__note-title {
    display: flex;
    align-items: center;
    gap: 4px;
    @include font-t14m;
    margin-bottom: 4px;
    color: #000;
    .icon-question {
      font-size: 1.5rem;
      &:before {
        color: $light-blue-100;
      }
    }
  }
  &__note-list {
    padding-left: 2px;
    margin: 0;
    list-style: none;
  }
  &__note-item {
    @include font-t14r;
    color: #000;
    padding-left: 1em;
    text-indent: -1em;
    &:before {
      content: "•";
      padding-right: 5px;
    }
  }
  &__empty {
    display: grid;
    place-content: center;
  }
  &__inner {
    &:first-child {
      flex: 0 0 30%;
    }
    &:last-child {
      flex: 1;
    }
  }
}
</style>
