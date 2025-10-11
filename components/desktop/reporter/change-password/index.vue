<template>
  <ModalCommon
    :id="modalId"
    :ref="modalId"
    title="Thay đổi mật khẩu"
    modal-class="modal-mobile-bottom"
    @hide-modal="onHiddenModal"
  >
    <div class="change-password">
      <div class="change-password__container">
        <div class="change-password__form">
          <div class="change-password__form-item">
            <base-input-label
              v-model="formData.currentPassword"
              type="text"
              :label="$t('common.current_password')"
              :placeholder="$t('placeholder.password')"
              :limit-input="32"
              :min-length="8"
            />
          </div>
          <div class="change-password__form-item">
            <base-input-label
              v-model="formData.newPassword"
              type="password"
              :label="$t('common.new_password')"
              :placeholder="$t('placeholder.password')"
              :limit-input="32"
              :min-length="8"
            />
          </div>
          <div class="change-password__form-item">
            <base-input-label
              v-model="formData.confirmNewPassword"
              type="password"
              :label="$t('common.confirm_new_password')"
              :placeholder="$t('placeholder.password')"
              :limit-input="32"
              :min-length="8"
              :same-as="formData.newPassword"
            />
          </div>
        </div>
        <div class="change-password__action">
          <base-button variants="contained" full-width color="info" @click="onClose">
            {{ $t('action.close') }}
          </base-button>
          <base-button
            variants="contained"
            full-width
            color="primary"
            :disabled="disabledConfirmed"
            :loading="isLoading"
            @click="onConfirmChangePassword"
          >
            {{ $t('home.confirm') }}
          </base-button>
        </div>
      </div>
    </div>
  </ModalCommon>
</template>
<script>
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import REPORTER_API from '@/api/reporter';
import { mapActions } from 'vuex';
import { getSessionKey } from '@/helper/session';
import { MODAL } from '~/resources/modal';

export default {
  components: {
    ModalCommon,
    BaseInputLabel: () => import('~/components/common/base-input-label.vue'),
    BaseButton: () => import('@/components/common/base-button/index.vue')
  },
  data () {
    return {
      modalId: MODAL.CHANGE_PASSWORD,
      isLoading: false,
      formData: {
        currentPassword: '',
        confirmNewPassword: '',
        newPassword: ''
      }
    }
  },
  computed: {
    disabledConfirmed () {
      return this.formData?.currentPassword?.length < 8 ||
          this.formData?.confirmNewPassword?.length < 8 ||
          this.formData?.newPassword?.length < 8 ||
          this.formData?.newPassword !== this.formData?.confirmNewPassword
    }
  },
  methods: {
    ...mapActions('modal-response', ['showResponseModal']),
    ...mapActions('reporter', ['setUser']),
    onClose () {
      this.$bvModal.hide(this.modalId)
    },
    onHiddenModal () {
      this.formData.currentPassword = ''
      this.formData.confirmNewPassword = ''
      this.formData.newPassword = ''
    },
    async onConfirmChangePassword () {
      if (this.disabledConfirmed || this.isLoading) {
        return;
      }
      this.isLoading = true
      try {
        const result = await this.$axios.$post(REPORTER_API.CHANGE_PASSWORD, this.formData)
        if (result?.success) {
          this.$router.push('/')
          this.$cookies.remove('connect.sid');
          this.$cookies.remove('user');
          this.setUser(null);
          this.$cookies.remove(getSessionKey(window.location.host, this.$config));
        }
      } catch (error) {
        this.showResponseModal({
          title: this.$t('modal.title.system'),
          content: this.$t('modal.message.USERNAME_OR_PASSWORD_IS_INCORRECT'),
          show: true
        })
      } finally {
        this.isLoading = false
      }
    }
  }
};
</script>
<style scoped lang="scss">
.change-password {
  margin-top: 1.5rem;
  &__action {
    display: flex;
    gap: 1rem;
  }
}
</style>
