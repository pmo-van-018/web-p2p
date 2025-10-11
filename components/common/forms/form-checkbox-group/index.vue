<template>
  <b-form-group
    v-slot="{ ariaDescribedby }"
    :label="label"
  >
    <form-checkbox
      v-for="option in options"
      :key="option.value"
      v-model="selected"
      :value="option.value"
      plain
      stacked
      :aria-describedby="ariaDescribedby"
    >
      {{ option.text }}
    </form-checkbox>
  </b-form-group>
</template>
<script>
export default {
  components: {
    FormCheckbox: () => import('~/components/common/forms/form-checkbox/index.vue')
  },
  props: {
    value: {
      require: true
    },
    id: {
      type: String,
      require: true
    },
    label: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    selected: {
      get () {
        return this.value
      },
      set (value) { this.$emit('input', value) }
    }
  }
}
</script>
<style lang="scss" scoped>
:deep(.custom-control) {
  padding-bottom: 12px;
}
</style>
