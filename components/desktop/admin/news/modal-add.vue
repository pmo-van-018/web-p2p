<template>
  <ModalCommon
    :id="MODAL.ADD_NEWS"
    :ref="MODAL.ADD_NEWS"
    :title="$t('news.modal.add_title')"
    @hide-modal="hideModal"
  >
    <div class="add-news">
      <div class="add-news__container">
        <div class="add-news__inner">
          <div class="add-news__icon">
            <img src="/assets/images/common/blacklist/add-blacklist.svg" alt="icon blacklist" width="120" height="120">
          </div>
        </div>
        <div class="add-news__inner">
          <p class="add-news__text text-center m-0">{{ $t('news.modal.description') }}</p>
        </div>
        <div class="add-news__inner">
          <base-input-label
            ref="content"
            v-model="content"
            name="content"
            class="input mb-0"
            class-name="content-input"
            type="textarea"
            required="required"
            :label="$t('news.label.content')"
            :placeholder="$t('news.placeholder.content')"
            :label-require="$t('news.label.content_required')"
            @error="handleErrorValidation"
          />
        </div>
        <div class="add-news__inner">
          <div class="add-news__label">Ngày bắt đầu - ngày kết thúc</div>
          <report-date-picker-custom
            v-model="dateRange"
            class="w-100"
          />
        </div>
        <div class="add-news__inner">
          <div class="add-news__action">
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
              :disabled="disabledSubmit"
              :loading="isLoading"
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
import { mapActions, mapState } from 'vuex'
import { CONFIRM_TYPE, RESPONSE_ICON } from '@/resources/message';
import dayjs from 'dayjs';
import { ADMIN_NEW_API } from '~/api/new';
export default {
  components: {
    ModalCommon: () => import('~/components/desktop/modal/modal-common.vue'),
    BaseInputLabel: () => import('~/components/common/base-input-label.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    ReportDatePickerCustom: () => import('~/components/desktop/admin/news/date-picker.vue')
  },
  props: {
    managerId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      MODAL,
      content: null,
      dateRange: [new Date(), new Date()],
      isLoading: false,
      startDate: '',
      endDate: '',
      errorValidation: {
        content: false
      }
    }
  },
  computed: {
    ...mapState('user', ['user']),
    hasError () {
      return Object.values(this.errorValidation).includes(true);
    },
    disabledSubmit () {
      const emptyRequiredFields = !this.content || this.dateRange.length !== 2
      return this.hasError || emptyRequiredFields;
    }
  },
  methods: {
    ...mapActions('modal-response', ['showResponseModal']),
    close () {
      this.$bvModal.hide(MODAL.ADD_NEWS);
    },
    hideModal () {
      this.content = null;
      this.dateRange = [new Date(), new Date()]
      this.errorValidation = {
        content: false
      };
    },
    handleErrorValidation (errorValidation) {
      if (!errorValidation?.name) {
        return;
      }

      this.errorValidation = {
        ...this.errorValidation,
        [errorValidation.name]: errorValidation.error
      };
    },
    async handleSubmit () {
      try {
        this.isLoading = true;
        const result = await this.$axios.$post(ADMIN_NEW_API.CREATE, {
          content: this.content,
          start: dayjs(this.dateRange[0]).startOf('date').format(),
          end: dayjs(this.dateRange[1]).endOf('date').format()
        });
        if (!result?.errors?.length) {
          this.$emit('on-refresh')
          this.close()
          this.showResponseModal({
            title: this.$t('news.modal.add_title'),
            icon: RESPONSE_ICON.ADD_BLACK_LIST_SUCCESS,
            description: '',
            content: this.$t('news.modal.message.add_success'),
            type: 'success',
            show: true
          });
          return;
        }
        const keyError = result?.errors?.[0]?.key || 'error_system'
        this.handleError(keyError)
      } catch (error) {
        const keyError = error.response?.data?.errors?.[0]?.key || 'error_system'
        this.handleError(keyError)
      } finally {
        this.isLoading = false;
      }
    },
    handleError (keyError) {
      const modalConfig = {
        title: this.$t('news.modal.add_title'),
        icon: RESPONSE_ICON.ADD_BLACK_LIST_FAILED,
        description: this.$t(`modal.message.${keyError}`),
        content: this.$t('news.modal.message.add_failure'),
        confirmAction: this.$t('action.confirm'),
        confirmActionType: CONFIRM_TYPE.CLOSE,
        show: true
      };

      this.showResponseModal(modalConfig);
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/desktop/admin/news/add-modal.scss" />
