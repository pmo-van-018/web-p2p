<template>
  <b-tabs content-class="tab-panel" fill>
    <template #tabs-end>
      <b-nav-item
        v-for="(tab, index) in tabs"
        :id="tab.key"
        :key="index"
        v-b-tooltip.hover.bottom
        href="javascript:void(0)"
        role="presentation"
        tabindex="0"
        :title="tab.tooltip"
        :active="currentTab === index"
        :disabled="tab.disabled"
        @click="handleActiveTab(tab, index)"
      >
        <div class="tab-panel__header">
          <div v-if="tab.icon" class="tab-panel__logo">
            <img :src="tab.icon" :alt="tab.title">
          </div>
          <div class="tab-panel__title">{{ tab.title }}</div>
          <div v-if="tab.subTitle" class="tab-panel__sub-title">
            ({{ tab.subTitle }})
          </div>
        </div>
      </b-nav-item>
    </template>
  </b-tabs>
</template>
<script>
export default {
  props: {
    tabs: {
      type: Array,
      default: () => []
    },
    active: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      currentTab: null
    }
  },
  watch: {
    active (value) {
      this.currentTab = value
    }
  },
  mounted () {
    this.currentTab = this.active
  },
  methods: {
    handleActiveTab (tab, indexTab) {
      if (tab.disabled && tab.tooltip) {
        return;
      }
      this.currentTab = indexTab
      this.$emit('change-tab', tab)
    }
  }
}
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/tabs-panel/index.scss"></style>
