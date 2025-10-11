<template>
  <section class="detail-appeal">
    <loading v-if="isDetailLoading" />
    <div v-else class="detail-appeal__wrapper">
      <div class="detail-appeal__top">
        <appeal-detail-header :order="order" />
        <div v-if="isVisibleInformation" class="detail-appeal__close">
          <base-button
            variants="outlined"
            color="grey"
            @click="onOpenCloseAppeal"
          >
            {{ $t('admin.action.close_appeal') }}
          </base-button>
        </div>
      </div>
      <div class="detail-appeal__container">
        <div class="detail-appeal__left">
          <div class="detail-appeal__head">
            <div class="detail-content">
              <div class="detail-content__inner">
                <p class="detail-content__text">
                  <strong>{{ appealAtText }}</strong>
                </p>
                <p class="detail-content__text">
                  <span :class="['ml-2', dangerClass]">{{ appealAtDateTime }}</span>
                </p>
                <div v-if="isVisibleInformation" class="detail-content__extra" @click="onOpenExtraTimeAppeal">
                  <span class="detail-content__extra-icon icon-alarm-add" />
                  {{ $t('admin.action.extra_time') }}
                </div>
              </div>
              <div v-if="isVisibleAction" class="detail-content__context">
                <div class="detail-content__desc">
                  <p>{{ $t('admin.evident_content.win_case') }}</p>
                  <p>{{ $t('admin.evident_content.extra_time') }}</p>
                </div>
              </div>
            </div>

            <div v-if="isVisibleInformation" class="detail-note">
              <div class="detail-note__container">
                <ul class="detail-note__list">
                  <li class="detail-note__item">{{ $t('admin.note_detail.note_1') }}</li>
                  <li class="detail-note__item">{{ $t('admin.note_detail.note_2') }}</li>
                  <li class="detail-note__item">{{ $t('admin.note_detail.note_3') }}</li>
                  <li class="detail-note__item">{{ $t('admin.note_detail.note_4') }}</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="detail-appeal__body">
            <div class="detail-appeal__info">
              <information :order="order" />
            </div>

            <div class="detail-appeal__progress">
              <div class="detail-appeal__title">{{ $t('admin.progressing') }}</div>
              <div class="detail-appeal__steps">
                <steps-progressing :order="order" :appeal="appeal" />
              </div>
            </div>
          </div>

          <div v-if="isVisibleAction" class="detail-appeal__action">
            <base-button
              variants="outlined"
              color="primary"
              :disabled="isDetailLoading"
              @click="onOpenModalUserWon"
            >
              {{ $t('admin.action.user_won') }}
            </base-button>
            <base-button
              variants="contained"
              color="primary"
              :disabled="isDetailLoading"
              @click="onOpenModalMerchantWon"
            >
              {{ $t('admin.action.merchant_won') }}
            </base-button>
          </div>
        </div>
        <div class="detail-appeal__right">
          <chat-frame :order="orderAppealChat" />
        </div>
      </div>
    </div>
    <client-only>
      <modal-confirm-winner />
      <modal-extra-time-appeal />
    </client-only>
  </section>
</template>
<script>
import appealDetailMixin from '~/mixins/admin/appeal-detail'
export default {
  components: {
    StepsProgressing: () => import('~/components/desktop/admin/appeal-detail/steps/index.vue'),
    Information: () => import('~/components/desktop/admin/appeal-detail/information/index.vue'),
    ModalConfirmWinner: () => import('~/components/common/modal/appeal/confirm-winner/index.vue'),
    ModalExtraTimeAppeal: () => import('~/components/common/modal/appeal/extra-appeal-time/index.vue'),
    AppealDetailHeader: () => import('~/components/desktop/admin/appeal-detail/header/index.vue'),
    ChatFrame: () => import('~/components/desktop/admin/appeal-detail/chat/index.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  mixins: [appealDetailMixin]
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/admin/appeal-detail/index.scss">
</style>
