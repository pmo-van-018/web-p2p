<template>
  <ModalCommon
    :id="modalId"
    :ref="modalId"
    modal-class="modal-small modal-mobile-bottom"
    :title="$t('merchant.settings.maintenance.modal.title')"
    @hide-modal="$emit('hide')"
  >
    <div class="modal-content setting-maintenance">
      <div class="setting-maintenance__inner">
        <div class="setting-maintenance__thumb">
          <img src="/assets/images/components/desktop/maintenance/warning.svg" alt="icon">
        </div>
        <div class="setting-maintenance__content">
          {{ $t('merchant.settings.maintenance.modal.content_confirm') }}
        </div>
        <base-button
          variants="contained"
          color="primary"
          :loading="isLoading"
          @click="$emit('on-submit')"
        >
          {{ $t('action.confirm') }}
        </base-button>
      </div>
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
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      modalId: MODAL.SETTING_CONFIRM_MAINTENANCE_SYSTEM
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/settings/modal-settings-maintenance.scss"></style>
