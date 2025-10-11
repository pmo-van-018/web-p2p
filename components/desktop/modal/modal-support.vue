<template>
  <b-modal
    id="modalSupport"
    modal-class="modal-custom bottom modal-support"
    centered
    hide-header
    hide-footer
  >
    <div class="modal-support__content">
      <div class="modal-support__header">
        <div class="modal-support__title">{{ $t('transfer_seller.complain.title') }}</div>
        <div class="modal-support__close" @click="close()">
          <span class="icon-cancel" />
        </div>
      </div>
      <div class="modal-support__subtitle">
        {{ $t('transfer_seller.complain.sub_title') }}
      </div>
      <b-form-group v-slot="{ ariaDescribedby }">
        <b-form-radio
          v-model="selected"
          class="support-radio"
          :aria-describedby="ariaDescribedby"
          name="cancel-command-radios"
          value="A"
        >
          {{ $t('transfer_seller.complain.option_1') }}
        </b-form-radio>
        <b-form-radio
          v-model="selected"
          class="support-radio"
          :aria-describedby="ariaDescribedby"
          name="excess-money-radios"
          value="B"
        >
          {{ $t('transfer_seller.complain.option_2') }}
        </b-form-radio>
      </b-form-group>
      <button
        :disabled="!Boolean(selected)"
        type="button"
        class="primary modal-support__submit"
        @click="close"
      >
        {{ $t('transfer_seller.complain.submit_complain') }}
      </button>
    </div>
  </b-modal>
</template>
<script>
export default {
  data () {
    return {
      selected: ''
    };
  },
  methods: {
    close () {
      this.selected = '';
      this.$bvModal.hide('modalSupport');
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/desktop/modal/modal-support.scss"></style>
