<template>
  <div class="management-info">
    <div class="management-info__title">{{ $t('shift_management.title') }}</div>
    <div class="management-info__container">
      <div class="management-info__left">
        <div class="management-info__avatar">
          <span>{{ firstCharNickName }}</span>
        </div>
        <div class="management-info__content">
          <div class="management-info__name">{{ nickName }}</div>
          <div class="management-info__address">
            <span>{{ $t('role_management.label.wallet_address') }}:</span>
            <b>{{ walletAddress }}</b>
          </div>
        </div>
      </div>
      <div class="management-info__right">
        <base-button variants="outlined" color="primary" @click="handleOpenModalShiftManage">{{ $t(`shift_management.${isShiftProcessing ? 'checkout' : 'checkin'}.button`) }}</base-button>
      </div>
    </div>
  </div>
</template>
<script>
import { MODAL } from '@/resources/modal'
import { mapState } from 'vuex';

export default {
  components: {
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  computed: {
    ...mapState('user', ['user', 'isShiftProcessing']),
    firstCharNickName () {
      return this.user?.nickName ? this.nickName?.charAt(0) : 'M'
    },
    nickName () {
      return this.user?.nickName || ''
    },
    walletAddress () {
      return this.user?.walletAddress || ''
    }
  },
  methods: {
    handleOpenModalShiftManage () {
      this.$bvModal.show(MODAL.SHIFT_MANAGEMENT)
    }
  }
}
</script>
<style lang="scss" scoped>
.management-info {
  &__title {
    @include font-t20m;
    color: #000000;
    margin-bottom: 1rem;
  }
  &__container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    padding: 1rem;
  }
  &__content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  &__left {
    display: flex;
    gap: 1rem;
  }
  &__name {
    @include font-t16m;
    color: #191D23;
  }
  &__avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #13C7C7;
    font-size: 22px;
    font-weight: 700;
    text-transform: uppercase;
    background-color: #DBF9F9;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  &__right {
    .base-button {
      width: 156px;
    }
  }
  &__address {
    @include font-t14r;
    span {
      color: #73788B;
    }
    b {
      color: #49526A;
    }
  }
}
</style>
