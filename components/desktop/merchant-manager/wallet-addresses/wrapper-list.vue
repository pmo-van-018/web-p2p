<template>
  <div class="wrapper-list">
    <div class="wrapper-list__container">
      <div class="wrapper-list__head">
        <div class="wrapper-list__head-inner">
          <div class="wrapper-list__icon">
            <svg>
              <use xlink:href="#icon-wallet" />
            </svg>
          </div>
          <div class="wrapper-list__title">Danh sách ví liên kết</div>
        </div>
        <div class="wrapper-list__head-action">
          <base-button variants="outlined" color="primary" @click="openOpenCreateWalletAddress">
            <div class="d-flex align-items-center">
              <span class="icon-add-primary" />
              <span class="text">Thêm ví mới</span>
            </div>
          </base-button>
        </div>
      </div>
      <div class="wrapper-list__body">
        <list-wallet-address
          :wallet-addresses="walletAddresses"
          :nickname="nickname"
          :manager-id="managerId"
          :is-list-loading="isListLoading"
          @on-refresh-wallet="$emit('on-refresh-wallet')"
          @on-update-active-wallet="$emit('on-update-active-wallet')"
        />
      </div>
    </div>
    <client-only>
      <modal-add-wallet-address :manager-id="managerId" @on-refresh-wallet="$emit('on-refresh-wallet')" />
    </client-only>
  </div>
</template>
<script>
import { MODAL } from '@/resources/modal';

export default {
  components: {
    ListWalletAddress: () => import('~/components/desktop/merchant-manager/wallet-addresses/list.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    ModalAddWalletAddress: () => import('~/components/common/modal/modal-add-wallet.vue')
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
  methods: {
    openOpenCreateWalletAddress () {
      this.$bvModal.show(MODAL.ADD_WALLET)
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper-list {
  border-radius: 8px;
  border: 2px solid $grey-100;
  padding: calc(clamp(16px, 1.3vw, 24px));
  height: 100%;
  &__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid $grey-200;
    padding-bottom: 19px;
  }
  &__container {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    height: 100%;
  }
  &__body {
    margin-top: 11px;
    height: 100%;
  }
  &__head-inner {
    display: flex;
    align-items: center;
  }
  &__title {
    @include font-t16m;
    color: $grey-900;
    margin-left: 8px;
  }
  .base-button {
    min-width: 154px;
    padding: 8px 16px;
    .icon-add-primary {
      font-size: 22px;
    }
    .text {
      color: $grey-900;
      margin-left: 4px;
    }
  }
  &__icon {
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      width: inherit;
      height: inherit;
      object-fit: contain;
    }
  }
}
</style>
