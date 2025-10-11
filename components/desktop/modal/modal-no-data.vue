<template>
  <b-modal
    :id="MODAL.NO_DATA"
    :ref="MODAL.NO_DATA"
    modal-class="modal-custom bottom"
    centered
    hide-header
    hide-footer
  >
    <div class="no-data">
      <div class="no-data__container">
        <span class="icon-cancel" @click="$bvModal.hide(MODAL.NO_DATA)" />
        <div class="no-data__img">
          <svg>
            <use xlink:href="#icon-no-data" />
          </svg>
        </div>
        <div class="font-t14r grey-600">{{ $t('common.no_data') }}</div>
      </div>
    </div>
  </b-modal>
</template>
<script>
import { MODAL } from '@/resources/modal'

export default {
  data () {
    return {
      MODAL
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/modal/modal-no-data.scss">
</style>
