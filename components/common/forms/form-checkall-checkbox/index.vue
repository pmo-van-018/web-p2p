<template>
  <div class="form-check-all">
    <div class="form-check-all__container">
      <div v-if="isVisibleHead" class="form-check-all__head">
        <div class="form-check-all__title">{{ title }}</div>
        <div v-if="options.length" class="form-check-all__select-all">
          <b-form-checkbox
            v-model="allSelected"
            :indeterminate="indeterminate"
            aria-describedby="merchant"
            aria-controls="merchant"
            class="form-checkbox-custom form-checkbox-custom--reverse"
            @change="toggleAll"
          >
            {{ $t('common.select_all') }}
          </b-form-checkbox>
        </div>
      </div>
      <div v-if="options.length" class="form-check-all__body">
        <b-form-checkbox
          v-if="!isVisibleHead"
          v-model="allSelected"
          class="form-checkbox-custom form-check-all__select-all-inline"
          :indeterminate="indeterminate"
          aria-describedby="merchant"
          aria-controls="merchant"
          @change="toggleAll"
        >
          {{ $t('common.select_all') }}
        </b-form-checkbox>
        <b-form-group
          v-slot="{ ariaDescribedby }"
          label=""
        >
          <b-form-checkbox
            v-for="option in options"
            :key="option.value"
            v-model="selectedCheckBox"
            :value="option"
            class="form-checkbox-custom form-checkbox-custom--space-bottom"
            :aria-describedby="ariaDescribedby"
            name="merchant-management"
            stack
          >
            <span class="form-check-all__content-text">{{ option.text }}</span>
          </b-form-checkbox>
          <observer @intersect="$emit('intersect')" />
        </b-form-group>
      </div>
      <no-data v-else />
    </div>
  </div>
</template>
<script>
export default {
  components: {
    NoData: () => import('~/components/common/no-data.vue'),
    Observer: () => import('~/components/common/observer/index.vue')
  },
  props: {
    isVisibleHead: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    },
    selected: {
      type: Array,
      default: () => []
    },
    isReset: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selectedCheckBox: [],
      allSelected: false,
      indeterminate: false
    }
  },
  watch: {
    selectedCheckBox (newValue, oldValue) {
      if (newValue.length === 0) {
        this.indeterminate = false
        this.allSelected = false
      } else if (newValue.length === this.options.length) {
        this.indeterminate = false
        this.allSelected = true
      } else {
        this.indeterminate = true
        this.allSelected = false
      }
      this.$emit('input', newValue)
    },
    selected: {
      handler (values) {
        this.selectedCheckBox = values
      },
      immediate: true
    },
    isReset (value) {
      if (value) {
        this.selectedCheckBox = []
      }
    }
  },
  methods: {
    toggleAll (allSelected) {
      this.selectedCheckBox = allSelected ? this.options.slice() : []
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/forms/form-checkall-checkbox/index.scss">
</style>
<style lang="scss" scoped src="static/assets/scss/components/common/forms/form-checkbox/index.scss">
</style>
