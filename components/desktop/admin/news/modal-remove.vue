<template>
  <ModalCommon
    :id="modalId"
    :ref="modalId"
    :title="$t('news.modal.remove_title')"
  >
    <div class="remove-news">
      <div class="remove-news__container">
        <div class="remove-news__inner">
          <div class="remove-news__icon">
            <img src="/assets/images/common/blacklist/remove-blacklist.svg" alt="icon blacklist" width="120" height="120">
          </div>
        </div>
        <div class="remove-news__inner">
          <p class="remove-news__text text-center m-0">{{ $t('news.modal.remove_description') }}</p>
        </div>
        <div class="remove-news__inner">
          <div class="remove-news__action">
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
import { ADMIN_NEW_API } from '~/api/new';
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
      modalId: MODAL.REMOVE_NEWS
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
        const { errors } = await this.$axios.$delete(`${ADMIN_NEW_API.DELETE(this.currentId)}`);
        if (!errors?.length) {
          this.$emit('on-refresh')
          this.close()
          this.showResponseModal({
            title: this.$t('news.modal.remove_title'),
            icon: RESPONSE_ICON.REMOVE_BLACK_LIST_SUCCESS,
            description: '',
            content: this.$t('news.modal.message.delete_success'),
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
        title: this.$t('news.modal.remove_title'),
        icon: RESPONSE_ICON.REMOVE_BLACK_LIST_FAILED,
        description: this.$t(`modal.message.${keyError}`),
        content: this.$t('news.modal.message.delete_failure'),
        confirmAction: this.$t('action.confirm'),
        confirmActionType: CONFIRM_TYPE.CLOSE,
        show: true
      };

      this.showResponseModal(modalConfig);
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/desktop/admin/news/remove-modal.scss" />
