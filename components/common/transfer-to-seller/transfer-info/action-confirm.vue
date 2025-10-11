<template>
  <div class="action-confirm">
    <div class="action-confirm__title">
      {{ $t('transfer_seller.info.label.confirm_after_transfer') }}
    </div>
    <div class="action-confirm__container">
      <button class="primary action-confirm__submit" @click="$emit('confirm-payment')">{{ $t('action.submit_transferred') }}</button>
      <button class="link" @click="$emit('cancel-payment')">{{ $t('action.cancel_transaction') }}</button>
    </div>
  </div>
</template>

<style lang="scss" scoped src="static/assets/scss/components/common/transfer-to-seller/transfer-info/action-confirm.scss" />
