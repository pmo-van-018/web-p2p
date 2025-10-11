<template>
  <div class="overview-card">
    <div class="overview-card__container">
      <div class="overview-card__inner align-items-center">
        <div class="overview-card__title">
          {{ overviewData.title }}
          <template v-if="overviewData.note">
            <b-tooltip :target="id" :triggers="tooltipTextGuideTrigger" :placement="placement">
              <div v-html="overviewData.note" />
            </b-tooltip>
            <span
              :id="id"
              v-b-tooltip.focus
              tabindex="0"
              class="overview-card__inner-icon icon-info-circle cursor-pointer"
            />
          </template>
        </div>
        <div class="overview-card__icon">
          <img :src="overviewData.icon" :alt="overviewData.title">
        </div>
      </div>
      <div class="overview-card__inner overview-card__inner--bottom">
        <div v-if="overviewData.format" class="overview-card__content">{{ overviewData.value | overviewData.format }}<sup v-if="overviewData.symbol">{{ overviewData.symbol }}</sup></div>
        <div v-else class="overview-card__content">{{ overviewData.value }}<sup v-if="overviewData.symbol">{{ overviewData.symbol }}</sup></div>
        <div v-if="isShowDetailTotal" class="overview-card__type">
          <div class="overview-card__type-text buy-color">{{ overviewData.buyAmount || 0 }} {{ $t('common.buy') }}</div>
          <div class="overview-card__type-text sell-color">{{ overviewData.sellAmount || 0 }} {{ $t('common.sell') }}</div>
        </div>
      </div>
    </div>
  </div>
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
      return 'transaction' + Math.random()
    },
    placement () {
      return 'top';
    },
    tooltipTextGuideTrigger () {
      return this.$device.isMobileOrTablet ? 'focus' : 'hover';
    },
    isShowDetailTotal () {
      return !isNaN(this.overviewData.buyAmount) || !isNaN(this.overviewData.sellAmount);
    }
  }
}
</script>
<style lang="scss" scoped>
.overview-card {
  padding: 1rem;
  border-radius: 8px;
  background-color: var(--mode-light-dark-0);
  box-shadow: 0px 1.548px 1.956px 0px rgba(12, 20, 45, 0.01), 0px 7.319px 7.644px 0px rgba(12, 20, 45, 0.01), 0px 19px 24px 0px rgba(12, 20, 45, 0.02);

  &__container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  &__title {
    @include font-t14r;
    color: var(--mode-light-dark-900);
    margin-right: 1rem;
  }
  &__icon {
    img {
      width: 23px;
      height: 23px;
      object-fit: contain;
    }
  }
  &__inner {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }
  &__content {
    @include font-t40m;
    color: #05A7A7;
    sup {
      @include font-t12r;
      top: -30px;
      text-transform: lowercase;
      @media (min-width: 1024px) {
        @include font-t14r;
      }
    }
  }
  &__type {
    display: flex;
    gap: 8px;
    align-items: center;
    text-transform: lowercase;
  }
  &__type-text {
    @include font-t16m;
    buy {
      color: #45B957;
    }
    sell {
      color: #FF2E2E;
    }
  }
}
</style>
