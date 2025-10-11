<template>
  <b-form-group
    v-slot="{ ariaDescribedby }"
    label=""
    class="form-multiple"
  >
    <b-form-checkbox
      v-for="option in options"
      :key="option.key"
      v-model="selected"
      :value="option"
      :aria-describedby="ariaDescribedby"
      name="checkbox"
      inline
      @change="$emit('change', $event)"
    >
      <slot name="option" :option="option" :selected="selected">
        <report-action
          :item="option"
          :active="activeReport(option)"
        />
      </slot>
    </b-form-checkbox>
  </b-form-group>
</template>
<script>
export default {
  components: {
    ReportAction: () => import('~/components/desktop/reports/report-action.vue')
  },
  props: {
    options: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      selected: []
    }
  },
  methods: {
    activeReport (option) {
      return this.selected.some(e => e.key === option.key)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/reports/report-multiple-check.scss">
</style>
