<template>
  <ModalCommon
    :id="MODAL.AD_RESULT"
    :ref="MODAL.AD_RESULT"
    :title="title"
  >
    <div class="modal-content">
      <div class="ml-auto mr-auto">
        <img :src="require('~imageRoot/common/post/adv-completed.svg')" alt="icon adv" width="120">
      </div>
      <div class="description grey-600">
        {{ description }}
      </div>
      <div class="ad-info">
        <div class="row-info">
          <div class="label">{{ $t('form_post.modal.label.ad_id') }}</div>
          <div class="value">#{{ adID }}</div>
        </div>
        <div class="divider" />
        <div class="row-info">
          <div class="label">{{ $t('form_post.modal.label.status') }}</div>
          <div class="value value--info">
            <span :class="status">{{ $t('form_post.status.'+status) }}</span>
            <span v-b-tooltip class="icon-info info-block__icon" :title="tooltipStatus" />
          </div>
        </div>
      </div>
      <base-button variants="contained" color="primary" full-width @click="onSuccess">
        {{ $t('add_bank_modal.completed') }}
      </base-button>
    </div>
  </ModalCommon>
</template>
<script>
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import { MODAL } from '@/resources/modal.js';

export default {
  components: {
    ModalCommon,
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    isManager: {
      type: Boolean,
      default: false
    },
    adInfo: {
      type: Object,
      default: () => ({})
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      MODAL
    }
  },
  computed: {
    adID () {
      return this.adInfo.id || ''
    },
    isOnline () {
      return this.adInfo.showAd
    },
    status () {
      return this.isOnline ? 'online' : 'offline'
    },
    title () {
      return this.isEdit ? this.$t('modal.ad_result.update_title') : this.$t('modal.ad_result.create_title')
    },
    description () {
      if (this.isEdit) {
        return this.isOnline ? this.$t('form_post.modal.description.update_success') : this.$t('form_post.modal.description.update_success_offline')
      } else {
        return this.isOnline ? this.$t('form_post.modal.description.create_success') : this.$t('form_post.modal.description.create_success_offline')
      }
    },
    tooltipStatus () {
      return this.isOnline ? this.$t('form_post.modal.tooltip.status') : this.$t('form_post.modal.tooltip.status_offline')
    }
  },
  methods: {
    onSuccess () {
      this.$bvModal.hide(MODAL.AD_CONFIRM)
      if (this.isManager) {
        this.$router.push('/merchant-manager/postings')
        return;
      }
      this.$router.push('/merchant/postings')
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/modal/modal-ad-result.scss"></style>
