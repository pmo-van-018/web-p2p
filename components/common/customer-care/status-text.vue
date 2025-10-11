<template>
  <div class="status-text" :class="getClassStatusRequest">
    <div class="status-text__inner">{{ getTextStatusRequest }}</div>
  </div>
</template>
<script>
import dayjs from 'dayjs'

export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    getClassStatusRequest () {
      return dayjs().diff(this.item?.createdAt, 'hour') < 12 ? 'new' : 'old'
    },
    getTextStatusRequest () {
      return dayjs().diff(this.item?.createdAt, 'hour') < 12 ? this.$t('common.new') : this.$t('common.old')
    }
  }
}
</script>
<style lang="scss" scoped>
.status-text {
  padding: 6px 1rem;
  @include font-t12m;
  border-radius: 4px;
  background: rgba(238, 84, 62, 0.05);
  display: inline-flex;
  &__inner {
    color: $red-500;
  }
  &.new {
    background: #EEF9F9;
    .status-text__inner {
      color: $persian-green;
    }
  }
  @media (max-width: 992px) {
    padding: 1px 8px;
    @include font-t10m;
  }
}
</style>
