<template>
  <ModalCommon
    :id="MODAL.WARNING_LOGOUT"
    :ref="MODAL.WARNING_LOGOUT"
    :modal-class="`modal-small${isMobile ? ' mobile' : ''}`"
    no-close-on-backdrop
    @on-close="handleFinish"
  >
    <div class="modal-content">
      <div class="ml-auto mr-auto">
        <img :src="require('~imageRoot/common/notification/notification-failed.svg')" alt="icon failed" width="120">
      </div>

      <div class="description">
        <span>{{ $t('warning_logout.descriptions.first_wrapper') }} </span>
        <span class="description__content">{{ descriptionContent }} </span>
        <span>{{ $t('warning_logout.descriptions.last_wrapper') }} </span>
      </div>

      <div class="countdown-box">
        <count-down-timer
          :time-left="timeleft"
          @time-out="handleFinish"
        />
      </div>

      <base-button
        variants="contained"
        color="primary"
        @click="handleFinish"
      >
        {{ $t('warning_logout.button_text') }}
      </base-button>
    </div>
  </ModalCommon>
</template>

<script>
import { MODAL } from '@/resources/modal';
import { mapState } from 'vuex';

export default {
  components: {
    ModalCommon: () => import('~/components/desktop/modal/modal-common.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    CountDownTimer: () => import('~/components/common/countdown-timer.vue')
  },
  props: {
    isMobile: {
      type: Boolean,
      defaults: false
    }
  },
  data () {
    return {
      MODAL,
      timeleft: 10000
    };
  },
  computed: {
    ...mapState('user', ['user']),
    descriptionContent () {
      return this.user?.nickName
    }
  },
  methods: {
    handleFinish () {
      this.$bvModal.hide(MODAL.WARNING_LOGOUT);
      this.$emit('on-close');
    }
  }
}
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/modal/modal-warning-logout.scss" />
