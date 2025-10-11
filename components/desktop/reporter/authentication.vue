<template>
  <section class="authentication">
    <div class="authentication__container">
      <div class="authentication__wrapper">
        <div class="authentication__logo">
          <img :src="require('~imageRoot/common/header/logo-ano-dark.svg')" alt="Logo Ano">
        </div>
        <div class="authentication__form">
          <div class="authentication__form-head">
            <h1 class="authentication__form-title">{{ $t('common.login') }}</h1>
            <p class="authentication__form-desc">{{ $t('reporter.description') }}</p>
          </div>
          <div class="authentication__form-body">
            <div class="authentication__form-item">
              <base-input-label
                v-model="formData.username"
                type="text"
                :label="$t('common.username')"
                :placeholder="$t('placeholder.username')"
                :limit-input="32"
              />
            </div>
            <div class="authentication__form-item">
              <base-input-label
                v-model="formData.password"
                type="password"
                :label="$t('common.password')"
                :placeholder="$t('placeholder.password')"
                :limit-input="32"
                :min-length="8"
                @onKeyUpEnter="onSubmitAuthentication"
              />
            </div>
            <div class="authentication__form-item">
              <base-button
                full-width
                variants="contained"
                color="primary"
                :loading="isLoading"
                :disabled="disabledFormData"
                @click="onSubmitAuthentication"
              >
                {{ $t('common.login') }}
              </base-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer-section />
  </section>
</template>
<script>
import REPORTER_API from '@/api/reporter'
import { mapActions } from 'vuex';
import BaseInputLabel from '~/components/common/base-input-label.vue'
import FooterSection from '~/components/common/footer/index.vue'

export default {
  components: {
    BaseInputLabel,
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    FooterSection
  },
  data () {
    return {
      formData: {
        username: '',
        password: ''
      },
      isLoading: false
    }
  },
  computed: {
    disabledFormData () {
      return !this.formData?.username || this.formData?.password?.length < 8
    }
  },
  methods: {
    ...mapActions('modal-response', ['showResponseModal']),
    async onSubmitAuthentication () {
      if (this.disabledFormData || this.isLoading) {
        return;
      }
      this.isLoading = true
      try {
        const result = await this.$axios.$post(REPORTER_API.LOGIN_PASSWORD, this.formData)
        if (result?.success) {
          window.location.reload()
        }
      } catch (error) {
        this.showResponseModal({
          title: this.$t('modal.title.system'),
          content: this.$t('modal.message.login_information_failed'),
          show: true
        })
        this.isLoading = false
      }
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/reporter/authentication.scss">
</style>
