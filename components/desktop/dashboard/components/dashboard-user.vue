<template>
  <div v-if="overviewUser.length" class="dashboard-user__container">
    <div class="dashboard-user__title">
      <img :src="icon" alt="user icon">
      {{ title }}
    </div>
    <div v-for="item in overviewUser" :key="item.title" class="dashboard-user__wrapper">
      <div class="dashboard-user__item">
        <div class="dashboard-user__item-title">
          {{ item.title }}
          <template v-if="item.note">
            <b-tooltip :target="item.id" :triggers="tooltipTextGuideTrigger" :placement="placement">
              <div v-html="item.note" />
            </b-tooltip>
            <span
              :id="item.id"
              v-b-tooltip.focus
              tabindex="0"
              class="dashboard-user__inner-icon icon-info-circle cursor-pointer"
            />
          </template>
        </div>
        <div class="dashboard-user__item-value">
          {{ item.value }}
          <span v-if="item?.symbol">{{ item?.symbol }}</span>
        </div>
      </div>
      <div v-if="item?.subContent" class="dashboard-user__item sub-content">
        <div class="dashboard-user__item-title">{{ item.subContent.title }}</div>
        <div class="dashboard-user__item-value">
          {{ item.subContent.value }}
          <span v-if="item?.symbol">{{ item?.symbol }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  props: {
    role: {
      type: String,
      default: 'admin'
    },
    overviewUser: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    placement () {
      return 'top';
    },
    tooltipTextGuideTrigger () {
      return this.$device.isMobileOrTablet ? 'focus' : 'hover';
    },
    icon () {
      return `/assets/icons/dashboard/${this.role}-user.svg`
    },
    title () {
      const titleId = `overview.manager_user.${this.role}`
      return this.$t(titleId)
    }
  }
}
</script>
<style lang="scss" scoped>
.dashboard-user {
  &__container {
    padding: 24px;
    border-radius: 6px;
    background-color: var(--mode-light-dark-0);
    box-shadow: 0px 1.548px 1.956px 0px rgba(12, 20, 45, 0.01), 0px 7.319px 7.644px 0px rgba(12, 20, 45, 0.01), 0px 19px 24px 0px rgba(12, 20, 45, 0.02);
  }
  &__title {
    @include font-t16b;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--mode-light-dark-1000);
  }

  &__wrapper {
    padding: 16px 8px;
    border-bottom: solid 1px var(--mode-light-dark-300);
    &:last-child {
      padding-bottom: 0;
      border-bottom: none;
    }
  }

  &__item {
    @include font-t14r;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &.sub-content {
      margin-top: 12px;
    }
  }

  &__item-value {
    font-weight: 700;
    margin-top: 6px;
  }
}

</style>
