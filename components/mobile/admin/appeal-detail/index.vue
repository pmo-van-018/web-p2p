<template>
  <section class="detail-appeal">
    <loading v-if="isDetailLoading" />
    <div v-else class="detail-appeal__wrapper">
      <div class="detail-appeal__top">
        <appeal-detail-header :order="order" />
      </div>
      <div class="detail-appeal__container">
        <div class="detail-appeal__head">
          <div class="detail-content">
            <div class="detail-content__inner">
              <div class="d-flex flex-column">
                <p class="detail-content__text">
                  <strong>{{ appealAtText }}</strong>
                </p>
                <p class="detail-content__text">
                  <span :class="[dangerClass]">{{ appealAtDateTime }}</span>
                </p>
              </div>
              <div v-if="isVisibleInformation" class="detail-content__extra" @click="onOpenExtraTimeAppeal">
                <span class="detail-content__extra-icon icon-add-time" />
              </div>
            </div>
            <div v-if="isVisibleInformation" class="detail-content__context">
              <div class="detail-content__desc">
                <p>{{ $t('admin.evident_content.win_case') }}</p>
                <p>{{ $t('admin.evident_content.extra_time') }}</p>
              </div>
            </div>
          </div>
        </div>
        <collapse-appeal v-if="isVisibleInformation" :title="$t('home.note')" icon="icon-question" class-header="note">
          <div class="detail-note">
            <div class="detail-note__container">
              <ul class="detail-note__list">
                <li class="detail-note__item">{{ $t('admin.note_detail.note_1') }}</li>
                <li class="detail-note__item">{{ $t('admin.note_detail.note_2') }}</li>
                <li class="detail-note__item">{{ $t('admin.note_detail.note_3') }}</li>
                <li class="detail-note__item">{{ $t('admin.note_detail.note_4') }}</li>
              </ul>
            </div>
          </div>
        </collapse-appeal>
        <collapse-appeal :title="$t('transfer_seller.cancel.label.transaction_info')">
          <order-info :order-detail="order" no-border is-show-all />
        </collapse-appeal>
        <collapse-appeal :title="$t('transfer_seller.cancel.label.payment_methods')">
          <order-method
            :order-detail="order"
            no-border
            is-show-all
            disable-payment-status-completed
            :is-show-qr-code="false"
          />
        </collapse-appeal>
        <collapse-appeal :title="$t('merchant.transaction_detail.cryptocurrency_trading')">
          <order-list-tx :order-detail="order" no-border />
        </collapse-appeal>
        <collapse-appeal :title="$t('admin.progressing')">
          <div class="detail-appeal__steps">
            <steps-progressing :order="order" :appeal="appeal" />
          </div>
        </collapse-appeal>

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
        <div v-if="isVisibleInformation" class="detail-content__close">
          <base-button
            variants="text"
            color="primary"
            @click="onOpenCloseAppeal"
          >
            {{ $t('admin.action.close_appeal') }}?
          </base-button>
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
    ModalConfirmWinner: () => import('~/components/common/modal/appeal/confirm-winner/index.vue'),
    ModalExtraTimeAppeal: () => import('~/components/common/modal/appeal/extra-appeal-time/index.vue'),
    AppealDetailHeader: () => import('~/components/desktop/admin/appeal-detail/header/index.vue'),
    CollapseAppeal: () => import('~/components/mobile/admin/appeal-detail/collapse-appeal/index.vue'),
    OrderInfo: () => import('~/components/desktop/admin/appeal-detail/order-info/index.vue'),
    OrderMethod: () => import('~/components/desktop/merchant/order-detail/order-method.vue'),
    OrderListTx: () => import('~/components/desktop/merchant/order-detail/order-list-tx.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  mixins: [appealDetailMixin]
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/admin/appeal-detail/index.scss">
</style>
