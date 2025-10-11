<template>
  <ModalCommon
    :id="modalId"
    :ref="modalId"
    @before-hide-modal="hideModal"
  >
    <div class="referral-code">
      <div class="referral-code__container">
        <div class="referral-code__thumbnail">
          <img :src="require('~imageRoot/common/referral-code/box-referral-code.svg')" alt="Referral Code">
        </div>
        <div class="referral-code__title">{{ $t('referral_code.title') }}</div>
        <div>
          <div class="referral-code__input">
            <base-input-label
              ref="referralCode"
              v-model="referralCodeInput"
              :class-name="errorText ? 'referral-code__input-border-error' : null"
              :placeholder="$t('referral_code.placeholder_input')"
              :limit-input="limitReferralCode"
              remove-all-space-special-character
            />
            <span
              v-if="$device.isDesktop"
              class="referral-code__input-copy"
              @click="onPastedText"
            >{{ $t('common.paste') }}</span>
          </div>
          <span v-show="errorText" class="referral-code__input-error">{{ errorText }}</span>
        </div>
        <div class="referral-code__action">
          <base-button
            variants="contained"
            color="primary"
            full-width
            :loading="isLoading"
            :disabled="isLoading || !isSubmit"
            @click="onSubmitReferralCode"
          >
            {{ $t('action.confirm') }}
          </base-button>
        </div>
      </div>
    </div>
  </ModalCommon>
</template>
<script>
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import { MODAL } from '@/resources/modal.js';
import REFERRAL_CODE_API from '@/api/referral-code'
import { mapActions, mapState } from 'vuex'
import { trimMultipleSpaceStartEndString } from '~/helper'

export default {
  components: {
    ModalCommon,
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    BaseInputLabel: () => import('~/components/common/base-input-label.vue')
  },
  data () {
    return {
      modalId: MODAL.REFERRAL_CODE,
      referralCodeInput: '',
      errorText: '',
      limitReferralCode: 8,
      isLoading: false
    }
  },
  computed: {
    ...mapState('user', ['user']),
    isSubmit () {
      return !this.$refs.referralCode?.$v.$invalid &&
          this.referralCodeInputTrimSpace &&
          this.referralCodeInput.length === this.limitReferralCode
    },
    referralCodeInputTrimSpace () {
      return trimMultipleSpaceStartEndString(this.referralCodeInput)
    }
  },
  watch: {
    referralCodeInput: {
      handler (value) {
        if (value.length === this.limitReferralCode) {
          this.errorText = ''
        }
        if (!value.length) {
          this.errorText = this.$t('referral_code.validator.required')
        }
      }
    }
  },
  methods: {
    ...mapActions('user', ['setUser']),
    async onPastedText (evt) {
      try {
        const text = await navigator.clipboard.readText()
        if (!this.referralCodeInput && text) {
          this.referralCodeInput = text.slice(0, this.limitReferralCode)
        }
      } catch (error) {
        console.error(error)
      }
    },
    hideModal () {
      this.referralCodeInput = ''
      this.$nextTick(() => {
        this.$refs.referralCode?.resetValidate()
        this.errorText = ''
      })
    },
    async onSubmitReferralCode () {
      try {
        this.isLoading = true
        const { status } = await this.$axios.post(REFERRAL_CODE_API.SUBMIT_CODE, {
          referralCode: this.referralCodeInputTrimSpace
        })
        if (status === 200) {
          this.$bvModal.hide(this.modalId)
          this.setUser({
            ...this.user,
            isReferred: true
          })
          setTimeout(() => {
            this.$bvModal.show(MODAL.REFERRAL_CODE_SUCCEED)
          })
        }
      } catch (error) {
        const code = parseInt(error.response && error.response.status, 10);
        if (code === 412) {
          const key = error.response?.data?.errors[0]?.key?.key || 'UNKNOWN'
          this.errorText = this.getErrorValidateRequest(key)
        } else {
          const key = error.response?.data?.errors[0]?.key || 'UNKNOWN'
          this.errorText = this.getErrorResponse(key)
        }
      } finally {
        this.isLoading = false
      }
    },
    getErrorResponse (keyError) {
      return {
        ALREADY_ENTERED_CODE: this.$t('referral_code.validator.already_code'),
        YOU_CANNOT_SUBMIT_YOUR_CODE: this.$t('referral_code.validator.invalid_your_code'),
        REFERRAL_CODE_NOT_FOUND: this.$t('referral_code.validator.invalid'),
        ENTER_REFERRAL_CODE_FAIL: this.$t('referral_code.validator.invalid'),
        UNKNOWN: this.$t('referral_code.validator.invalid')
      }[keyError]
    },
    getErrorValidateRequest (keyError) {
      return {
        CODE_INVALID: this.$t('referral_code.validator.invalid'),
        UNKNOWN: this.$t('referral_code.validator.invalid')
      }[keyError]
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/modal/referral-code/index.scss">
</style>
