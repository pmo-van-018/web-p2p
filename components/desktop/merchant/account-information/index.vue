<template>
  <div class="account-information">
    <Breadcrumd :items="breadcrumData" />
    <div class="account-information__content">
      No Content Here!
    </div>
  </div>
</template>
<script>
import Breadcrumd from '@/components/common/breadcrumd.vue';

export default {
  components: {
    Breadcrumd
  },
  data () {
    return {
      breadcrumData: [
        {
          title: this.$t('merchant.layout.account'),
          url: '/merchant/account-information',
          isActived: true
        }
      ]
    };
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/account-information/index.scss" />
