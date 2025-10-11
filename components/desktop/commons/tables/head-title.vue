<template>
  <div :class="['head-title', { 'head-title--cursor': isActiveSort }]">
    <div class="head-title__wrapper">
      <div :class="['head-title__inner', align]" @click="handleSortTitle">
        <div class="head-title__title">{{ label }}</div>
        <div v-if="isSort" :class="['head-title__arrow', sortFieldClass]">
          <span class="head-title__icon icon-sort-increase" />
          <span class="head-title__icon icon-sort-decrease" />
        </div>
      </div>
      <div class="head-title__sub-title mt-1">{{ subLabel }}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      default: ''
    },
    subLabel: {
      type: String,
      default: ''
    },
    sortField: {
      type: String,
      default: ''
    },
    isSort: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    resetSortField: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    align: {
      type: String,
      default: '',
      validator (value) {
        return ['', 'left', 'center', 'right'].includes(value)
      }
    }
  },
  data () {
    return {
      sortNumber: 1,
      sortFieldClass: ''
    }
  },
  computed: {
    isActiveSort () {
      return this.isSort && !this.isLoading && !this.disabled
    }
  },
  watch: {
    resetSortField (value) {
      if (value) {
        this.sortNumber = 1
        this.sortFieldClass = ''
      }
    }
  },
  methods: {
    handleSortTitle () {
      if (!this.isActiveSort) {
        return
      }
      if (this.sortNumber === 4 || this.resetSortField) {
        this.sortNumber = 1
      }
      const sortDirection = {
        1: 'ASC',
        2: 'DESC',
        3: ''
      }[this.sortNumber];
      this.sortFieldClass = sortDirection ? sortDirection.toLowerCase() : ''
      this.sortNumber = this.sortNumber + 1;
      this.$emit('change-sort', {
        sortField: this.sortField,
        sortDirection
      });
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/commons/table/head-title.scss">
</style>
