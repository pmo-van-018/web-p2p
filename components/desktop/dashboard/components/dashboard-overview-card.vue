<template>
  <article :class="`dashboard-overview-card ${overviewData.class || ''}`">
    <div class="dashboard-overview-card__title">
      {{ overviewData?.title }}
      <template v-if="overviewData.note">
        <b-tooltip :target="id" :triggers="tooltipTextGuideTrigger" :placement="placement">
          <div v-html="overviewData.note" />
        </b-tooltip>
        <span
          :id="id"
          v-b-tooltip.focus
          tabindex="0"
          class="dashboard-overview-card__inner-icon icon-info-circle cursor-pointer"
        />
      </template>
    </div>
    <div v-if="hasTotalValue" class="dashboard-overview-card__total-transaction">
      <div class="dashboard-overview-card__total-sum">
        {{ overviewData.value }}
        <sup v-if="overviewData?.symbol">{{ overviewData?.symbol }}</sup>
      </div>
      <div class="dashboard-overview-card__total-detail text-lowercase">
        <span class="font-t14m buy-color mr-1">
          {{ overviewData?.totalTransactionBuy }}
          {{ $t('common.buy') }}
        </span>
        <span class="font-t14m sell-color">
          {{ overviewData?.totalTransactionSell }}
          {{ $t('common.sell') }}
        </span>
      </div>
    </div>
    <div v-else class="dashboard-overview-card__value">
      {{ overviewData.value }}
      <sup v-if="overviewData?.symbol">{{ overviewData?.symbol }}</sup>
    </div>
  </article>
</template>
<script>
export default {
  props: {
    overviewData: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    id () {
      return 'overview' + Math.random()
    },
    placement () {
      return 'top';
    },
    hasTotalValue () {
      return !isNaN(this.overviewData.totalTransactionBuy) || !isNaN(this.overviewData.totalTransactionSell);
    },
    tooltipTextGuideTrigger () {
      return this.$device.isMobileOrTablet ? 'focus' : 'hover';
    }
  }
};
</script>
<style scoped lang="scss">
.dashboard-overview-card {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  flex-direction: column;
  gap: 8px;
  padding: 8px 16px;
  color: var(--mode-light-dark-900);
  border-radius: 8px;
  border: solid 1px var(--mode-light-dark-300);
  background-color: var(--mode-light-dark-0);
  &.grey-card {
    background-color: var(--mode-light-dark-100)
  }
  &.large-card {
    flex: 1.3;
  }
  &__title {
    @include font-t14r;
    white-space: nowrap;
    .icon-info-circle:before {
      color: var(--mode-light-dark-500)
    }
  }
  &__value {
    @include font-t16b;
    margin-top: 8px;
  }
  @media (max-width: 560px) {
    &__title {
      font-size: 12px;
      .icon-info-circle {
        font-size: 16px;
      }
    }
  }
  @media (max-width: 1500px) {
    min-width: 195px;
  }
  &__total-transaction {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    width: 100%;
  }
  &__total-sum {
    color: rgba(5, 167, 167, 1);
    font-size: 24px;
    font-weight: 600;
    sup {
      font-size: 14px;
      top: -12px;
      font-weight: 400;
    }
  }
}
</style>
