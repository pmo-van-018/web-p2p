<template>
  <ModalCommon
    :id="modalId"
    :ref="modalId"
    :title="$t('blacklist.modal.remove_title')"
  >
    <div class="remove-blacklist">
      <div class="remove-blacklist__container">
        <div class="remove-blacklist__inner">
          <div class="remove-blacklist__icon">
            <img src="/assets/images/common/blacklist/remove-blacklist.svg" alt="icon blacklist" width="120" height="120">
          </div>
        </div>
        <div class="remove-blacklist__inner">
          <p class="remove-blacklist__text text-center m-0">{{ $t('blacklist.modal.remove_description') }}</p>
        </div>
        <div class="remove-blacklist__inner">
          <div class="remove-blacklist__action">
            <base-button
              variants="contained"
              color="info"
              full-width
              @click="close"
            >
              {{ $t('action.aborted') }}
            </base-button>
            <base-button
              variants="contained"
              color="primary"
              full-width
              :loading="isLoading"
              :disabled="isLoading"
              @click="handleSubmit"
            >
              {{ $t('action.confirm') }}
            </base-button>
          </div>
        </div>
      </div>
    </div>
  </ModalCommon>
</template>
<script>
import { MODAL } from '@/resources/modal.js'
import { mapActions } from 'vuex'
import { CONFIRM_TYPE, RESPONSE_ICON } from '@/resources/message';
import { BLACKLIST_API } from '@/api/blacklist';
export default {
  components: {
    ModalCommon: () => import('~/components/desktop/modal/modal-common.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    currentId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isLoading: false,
      modalId: MODAL.REMOVE_BLACK_LIST
    }
  },
  methods: {
    ...mapActions('modal-response', ['showResponseModal']),
    close () {
      this.$bvModal.hide(this.modalId);
    },
    async handleSubmit () {
      try {
        this.isLoading = true;
        const { errors } = await this.$axios.$delete(`${BLACKLIST_API.REMOVE_WALLET_ADDRESS}/${this.currentId}`);
        if (!errors?.length) {
          this.$emit('on-refresh')
          this.close()
          this.showResponseModal({
            title: this.$t('blacklist.modal.remove_title'),
            icon: RESPONSE_ICON.REMOVE_BLACK_LIST_SUCCESS,
            description: '',
            content: this.$t('blacklist.modal.message.delete_success'),
            type: 'success',
            confirmAction: this.$t('action.confirm'),
            confirmActionType: CONFIRM_TYPE.CLOSE,
            show: true
          });
          return;
        }
        this.handleError(errors[0].key)
      } catch (error) {
        const keyError = error.response?.data?.errors?.[0]?.key || 'error_system'
        this.handleError(keyError)
      } finally {
        this.isLoading = false;
      }
    },
    handleError (keyError) {
      const modalConfig = {
        title: this.$t('blacklist.modal.remove_title'),
        icon: RESPONSE_ICON.REMOVE_BLACK_LIST_FAILED,
        description: this.$t(`modal.message.${keyError}`),
        content: this.$t('blacklist.modal.message.delete_failure'),
        confirmAction: this.$t('action.confirm'),
        confirmActionType: CONFIRM_TYPE.CLOSE,
        show: true
      };

      this.showResponseModal(modalConfig);
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/desktop/admin/blacklists/remove-modal-blacklist.scss" />
