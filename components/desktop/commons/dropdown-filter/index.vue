<template>
  <b-dropdown ref="dropdown" class="dropdown-filter">
    <template #button-content>
      <span v-if="getName(selected)" class="active">{{ $t(getName(selected)) }}</span>
      <span v-else class="grey">{{ title }}</span>
    </template>
    <div class="dropdown-content" :style="{ width: widthContent }">
      <slot>
        <b-dropdown-item
          v-for="(item, index) in listFilter"
          :key="index"
          class="filter-item"
          :class="{ active: selected && getValue(selected) === getValue(item) }"
          @click="$emit('on-select', item)"
        >
          <template v-if="item.imageUrl">
            <div class="d-flex align-items-center">
              <img :width="item.size ? item.size : 24" :src="item.imageUrl" :alt="$t(getName(item))" class="mr-2">
              {{ $te(getName(item)) ? $t(getName(item)) : getName(item) }}
            </div>
          </template>
          <template v-else>
            {{ $te(getName(item)) ? $t(getName(item)) : getName(item) }}
          </template>
        </b-dropdown-item>
      </slot>
    </div>
  </b-dropdown>
</template>

<script>
export default {
  props: {
    listFilter: {
      type: Array,
      default: () => []
    },
    selected: {
      type: Object,
      default: () => ({})
    },
    title: {
      type: String,
      default: ''
    },
    widthContent: {
      type: String,
      default: ''
    },
    nameAttribute: {
      type: String,
      default: 'name'
    },
    valueAttribute: {
      type: String,
      default: 'value'
    }
  },
  methods: {
    getName (item) {
      return item?.[this.nameAttribute];
    },
    getValue (item) {
      return item?.[this.valueAttribute];
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/commons/dropdown-filter/index.scss" />
