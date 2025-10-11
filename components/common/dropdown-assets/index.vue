<template>
  <div class="dropdown-assets">
    <div class="dropdown-assets__container">
      <b-dropdown variant="link" toggle-class="text-decoration-none" no-caret>
        <template #button-content>
          <div class="dropdown-header-asset">
            <div class="dropdown-header-asset__container">
              <div v-if="selectedAssetNetwork.length" class="dropdown-header-asset__list">
                <div class="dropdown-header-asset__wrapper">
                  <div v-for="asset in selectedAssetNetwork" :key="asset.key" class="dropdown-header-asset__item">
                    <img :src="asset.icon" :alt="asset.title" class="dropdown-header-asset__img">
                    <div class="dropdown-header-asset__text">{{ asset.title }} <span>({{ asset.subTitle }})</span></div>
                  </div>
                </div>
              </div>
              <div v-else class="dropdown-header-asset__left">
                <span class="icon-layer" />
                <span class="dropdown-header-asset__left-text">{{ $t('common.all') }}</span>
              </div>
              <div class="dropdown-header-asset__right">
                <span class="dropdown-header-asset__arrow icon-arrow" />
              </div>
            </div>
          </div>
        </template>
        <div class="dropdown-body-asset">
          <div class="dropdown-body-asset__list">
            <div class="dropdown-body-asset__item pl-2 mb-2" :class="{ 'checked': allSelected }" @click="selectedAll">
              <div class="dropdown-body-asset__inner">
                <span class="icon-layer" />
                <div class="dropdown-body-asset__text">{{ $t('common.all') }}</div>
              </div>
              <span v-show="allSelected" class="icon-check" />
            </div>
            <b-form-checkbox
              v-for="(asset) in assets"
              :key="asset.key"
              v-model="selectedAssetNetwork"
              :value="asset"
              class="dropdown-body-asset__item c-primary-checkbox"
              name="assets"
            >
              <div class="dropdown-body-asset__inner">
                <img class="dropdown-body-asset__icon" :src="asset.icon" :alt="asset.title">
                <div class="dropdown-body-asset__text" :class="{'active': selectedAssetNetwork.some(item => item.key === asset.key)}">
                  {{ asset.title }} <span>({{ asset.subTitle }})</span>
                </div>
              </div>
            </b-form-checkbox>
          </div>
        </div>
      </b-dropdown>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    assets: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      selectedAssetNetwork: [],
      allSelected: false
    }
  },
  watch: {
    selectedAssetNetwork: {
      handler (values) {
        this.allSelected = values?.length === this.assets.length;
        this.$emit('change', values)
      }
    }
  },
  methods: {
    selectedAll () {
      if (this.allSelected) {
        this.selectedAssetNetwork = [];
        this.allSelected = false;
      } else {
        this.allSelected = true;
        this.selectedAssetNetwork = this.assets
      }
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/dropdown-assets/index.scss">
</style>
