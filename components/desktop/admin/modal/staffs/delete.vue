<template>
  <modal-common
    :id="MODAL.DELETE_ADMIN_STAFF"
    :ref="MODAL.DELETE_ADMIN_STAFF"
    :title="$t('staffs.form_delete.title')"
    modal-class="modal-small"
    @hide-modal="hideModal"
  >
    <div class="modal-content">
      <div class="ml-auto mr-auto">
        <img :src="require('~imageRoot/common/operation/delete.svg')" alt="Icon Delete" width="112" height="112">
      </div>

      <div class="description grey-600">
        {{ getDescriptionMain }}
      </div>

      <div class="warning-group">
        <div class="d-flex align-items-center warning-group__head">
          <div class="warning-icon">
            <span class="icon-question" />
          </div>
          <div class="warning-group__title">{{ $t('staff.note') }}</div>
        </div>
        <div class="warning-info">
          <div v-for="(note, index) in notes" :key="index" class="info-block">
            <p class="step">{{ index + 1 }}.</p>
            <p class="text">
              {{ note }}
            </p>
          </div>
        </div>
      </div>

      <div class="button-group">
        <base-button
          variants="contained"
          color="primary"
          :loading="isLoading"
          :disabled="isLoading"
          @click="onDeleteStaff"
        >
          {{ $t('staffs.form_delete.confirm') }}
        </base-button>
        <base-button
          variants="contained"
          color="info"
          :disabled="isLoading"
          @click="close"
        >
          {{ $t('role_management.modal.cancel') }}
        </base-button>
      </div>
    </div>
  </modal-common>
</template>
<script>
import roleManagementMixin from '@/mixins/role-management'
import isEmpty from 'lodash/isEmpty'
import { ADMIN_STAFF } from '@/api/admin-staff'
import { MODAL } from '~/resources/modal.js'
import { USER_ROLE_CODE } from '~/config/constant';

export default {
  components: {
    ModalCommon: () => import('~/components/desktop/modal/modal-common.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  mixins: [roleManagementMixin],
  props: {
    staff: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      MODAL,
      isLoading: false,
      errorResult: null
    };
  },
  computed: {
    disabledSubmit () {
      return this.isLoading;
    },
    postfix () {
      return this.staff?.id ? this.staff?.id?.toString() : ''
    },
    getDescriptionMain () {
      if (USER_ROLE_CODE[this.staff?.type] === USER_ROLE_CODE.MERCHANT_OPERATOR) {
        return this.$t('staffs.form_delete.description_main.merchant_operator')
      }
      if (USER_ROLE_CODE[this.staff?.type] === USER_ROLE_CODE.MERCHANT_SUPPORTER) {
        return this.$t('staffs.form_delete.description_main.merchant_supporter')
      }
      return ''
    },
    notes () {
      let results = []
      if (USER_ROLE_CODE[this.staff?.type] === USER_ROLE_CODE.MERCHANT_OPERATOR) {
        results = [
          ...results,
          this.$t('staffs.form_delete.description_sub_1.merchant_operator'),
          this.$t('staffs.form_delete.description_sub_2.merchant_operator'),
          this.$t('staffs.form_delete.description_sub_3.merchant_operator'),
          this.$t('staffs.form_delete.description_sub_4.merchant_operator')
        ]
      }
      if (USER_ROLE_CODE[this.staff?.type] === USER_ROLE_CODE.MERCHANT_SUPPORTER) {
        results = [
          ...results,
          this.$t('staffs.form_delete.description_sub_1.merchant_supporter'),
          this.$t('staffs.form_delete.description_sub_2.merchant_supporter'),
          this.$t('staffs.form_delete.description_sub_3.merchant_supporter')
        ]
      }
      return results
    }
  },
  methods: {
    close () {
      this.$bvModal.hide(MODAL.DELETE_ADMIN_STAFF)
    },
    hideModal () {
      this.$emit('on-close')
    },
    handleSuccessfulDeleting () {
      this.$bvModal.hide(MODAL.DELETE_ADMIN_STAFF)
      setTimeout(() => {
        this.$bvModal.show(`${MODAL.SUCCESS_RESULT_ROLE_MANAGEMENT}${this.postfix}`)
      }, 100)
    },
    handleFailedDeleting (errorResult) {
      this.errorResult = errorResult;
      this.$bvModal.hide(MODAL.DELETE_ADMIN_STAFF)
      setTimeout(() => {
        this.$bvModal.show(`${MODAL.FAILURE_RESULT_ROLE_MANAGEMENT}${this.postfix}`)
      }, 100)
    },
    async onDeleteStaff () {
      try {
        this.isLoading = true;

        // Request to delete
        const result = await this.$axios.$delete(`${ADMIN_STAFF.DELETE}/${this.staff?.id}`);

        // The case the result is successful
        if (!isEmpty(result?.data)) {
          this.handleSuccessfulDeleting()
          return
        }

        // The case the result is failed
        this.handleFailedDeleting(result);
      } catch (e) {
        this.handleFailedDeleting(e);
        // eslint-disable-next-line no-console
        console.error(e);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/role-management/modal-delete.scss" />
