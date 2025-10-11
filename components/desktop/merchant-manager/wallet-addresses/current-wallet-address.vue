<template>
  <div class="current-wallet-address">
    <div class="current-wallet-address__container">
      <div class="current-wallet-address__head">
        <div class="current-wallet-address__head-inner">
          <div class="current-wallet-address__icon">
            <svg>
              <use xlink:href="#icon-scan-wallet" />
            </svg>
          </div>
          <div class="current-wallet-address__title">Ví đang sử dụng</div>
        </div>
      </div>
      <div class="current-wallet-address__body">
        <qrcode-vue :value="walletAddress" :size="300" level="H" class="current-wallet-address__qrcode" />
      </div>
      <div class="current-wallet-address__footer">
        <div class="current-address">
          <div class="current-address__inner">
            <div class="current-address__name">{{ $t('role_management.label.wallet_address') }}:</div>
            <div class="current-address__value">{{ walletAddress }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    QrcodeVue: () => import('qrcode.vue')
  },
  props: {
    walletAddress: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="scss" scoped>
.current-wallet-address {
  border-radius: 8px;
  border: 2px solid #EEEEF1;
  background: #fff;
  padding: calc(clamp(16px, 1.3vw, 24px));
  height: 100%;
  &__container {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }
  &__head {
    border-bottom: 1px solid $grey-200;
  }
  &__body {
    display: flex;
    justify-content: center;
  }
  &__head-inner {
    padding-bottom: 28px;
    display: flex;
    align-items: center;
  }
  &__title {
    @include font-t16m;
    color: $grey-900;
    margin-left: 8px;
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
.current-address {
  padding: 0.5rem 1rem;
  background-color: $neutrals-10;
  border-radius: 8px;
  &__inner {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }
  &__name {
    @include font-t14r;
    color: $grey-500;
  }
  &__value {
    @include font-t16m;
    color: $grey-900;
  }
}
</style>
