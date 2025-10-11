<template>
  <div
    :class="[
      'dashboard-transaction-card__item',
      { main: overview?.type === 'main' },
    ]"
  >
    <div class="dashboard-transaction-card__inner">
      <div class="dashboard-transaction-card__inner-text">
        <img v-if="overview?.icon" :src="overview.icon" class="dashboard-transaction-card__icon" alt="overview.title">
        {{ overview.title }}
      </div>
      <template v-if="overview.note">
        <b-tooltip :target="id" :triggers="tooltipTextGuideTrigger" :placement="placement">
          <div v-html="overview.note" />
        </b-tooltip>
        <span
          :id="id"
          v-b-tooltip.focus
          tabindex="0"
          class="dashboard-transaction-card__inner-icon icon-info-circle cursor-pointer"
        />
      </template>
    </div>
    <div class="dashboard-transaction-card__right">
      <div class="dashboard-transaction-card__value text-nowrap">
        {{ overview.content }}
        <sup v-if="overview?.symbol">{{ overview?.symbol }}</sup>
      </div>
      <template v-if="isShowDetailTotal">
        <div class="dashboard-transaction-card__detail-transaction">
          <span class="buy-color mr-2">
            {{ overview?.totalTransactionBuy }}
            {{ $t("common.buy") }}
          </span>
          <span class="sell-color">
            {{ overview?.totalTransactionSell }}
            {{ $t("common.sell") }}
          </span>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    overview: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    id () {
      return 'transaction-card' + Math.random()
    },
    placement () {
      return 'top';
    },
    isShowDetailTotal () {
      return !isNaN(this.overview?.totalTransactionBuy) || !isNaN(this.overview?.totalTransactionSell);
    },
    tooltipTextGuideTrigger () {
      return this.$device.isMobileOrTablet ? 'focus' : 'hover';
    }
  }
};
</script>
<style lang="scss" scoped>
.dashboard-transaction-card {
  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0.75rem;
    border-radius: 8px;
    border: solid 1.5px var(--mode-light-dark-200);
    &.main {
      flex-direction: column;
      justify-content: center;
      gap: 14px;
      height: 140px;
      text-align: center;
      background-color: var(--mode-light-dark-100);
      border: none;

      .dashboard-transaction-card__value {
        font-size: 32px;
        color: #05a7a7;
        background-color: transparent
      }
      sup {
        @include font-t14r;
        top: -16px;
      }
    }
    @media (max-width: 768px) {
      &.main {
        height: 100%;
        padding: 8px 12px;
        .dashboard-transaction-card__value {
          font-size: 16px;
          color: #05a7a7;
        }
        sup {
          font-size: 10px;
        }
      }
    }
  }
  &__icon {
    width: 28px;
    @media (max-width: 768px) {
      width: 16px;
    }
  }
  &__inner {
    display: flex;
    align-items: center;
  }

  &__inner-text {
    @include font-t14r;
    display: flex;
    align-items: flex-end;
    margin-right: 4px;
    color: var(--mode-light-dark-900);
  }

  &__inner-icon {
    font-size: 1rem;
    cursor: pointer;

    &:before {
      color: var(--mode-light-dark-500);
    }
  }

  &__detail-transaction {
    text-transform: lowercase;
    @media (min-width: 768px) {
      margin-top: 8px;
      @include font-t16m;
    }
  }

  &__value {
    @include font-t14m;
    padding: 5px 12px;
    text-align: center;
    color: var(--mode-light-dark-900);
    background-color: var(--mode-light-dark-200);
    border-radius: 4px;
  }
}
</style>
