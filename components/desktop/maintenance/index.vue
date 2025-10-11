<template>
  <div class="maintenance" :class="type">
    <div class="maintenance__container container-xl">
      <div class="maintenance__left">
        <span class="maintenance__icon icon-volume" />
        <span class="maintenance__notice">Thông báo:</span>
      </div>
      <div class="maintenance__right">
        <div class="marquee">
          <ul
            class="marquee__content"
            :style="{
              'animationDuration': ((contentMaintenanceList.length * 5) + 8) + 's'
            }"
          >
            <li v-for="(item, index) in contentMaintenanceList" :key="`item_${index}`">{{ item }}</li>
          </ul>
          <ul
            class="marquee__content"
            aria-hidden="true"
            :style="{
              'animationDuration': ((contentMaintenanceList.length * 5) + 8) + 's'
            }"
          >
            <li v-for="(item, index) in contentMaintenanceList" :key="`item_aria_${index}`">{{ item }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { WALLET_FORMATTED_SUPPORTED, WALLET_SUPPORTED } from '@/resources/maintenance';

export default {
  props: {
    type: {
      type: String,
      default: 'normal',
      validator (value) {
        return ['normal', 'green'].includes(value)
      }
    }
  },
  computed: {
    ...mapState('maintenance', ['walletMaintenance', 'assetMaintenance', 'news']),
    walletMaintenanceText () {
      return this.walletMaintenance.map((item) => {
        if (item === WALLET_SUPPORTED.WALLETCONNECT) {
          return this.$t('maintenance.wallet_connect')
        }
        return this.$t('maintenance.wallet', {
          wallet: WALLET_FORMATTED_SUPPORTED[item]
        })
      })
    },
    assetMaintenanceText () {
      const assets = this.assetMaintenance.reduce((acc, item) => {
        const result = item.match(/\(([^)]+)\)/)
        if (result[1] && !acc.includes(result[1])) {
          acc.push(result[1]);
        }
        return acc;
      }, []);
      return assets.map((item) => {
        return this.$t('maintenance.network', {
          network: item
        })
      })
    },
    newsText () {
      return this.news.map((item) => {
        return item.content;
      });
    },
    contentMaintenanceList () {
      return [...this.assetMaintenanceText, ...this.walletMaintenanceText, ...this.newsText]
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/maintenance/index.scss">
</style>
