<template>
  <b-modal
    :id="MODAL.SYSTEM_NOTE"
    :ref="MODAL.SYSTEM_NOTE"
    centered
    hide-header
    hide-footer
    no-close-on-esc
    no-close-on-backdrop
  >
    <div class="system-note">
      <div class="system-note__body">
        <h1 class="font-t20m text-center m-0">{{ $t('modal.system_note.title') }}</h1>
        <div class="system-note__icon">
          <svg>
            <use xlink:href="#resent-money" />
          </svg>
        </div>
        <div class="system-note__wrapper">
          <div class="system-note__list">
            <div class="system-note__item">
              <div class="note-index">
                <div class="note-index__number">1</div>
              </div>
              <div class="note-content">
                {{ $t('modal.system_note.note_1') }}
              </div>
            </div>
            <div class="system-note__item">
              <div class="note-index">
                <div class="note-index__number">2</div>
              </div>
              <div class="note-content">
                {{ $t('modal.system_note.note_2') }}
              </div>
            </div>
          </div>
        </div>
        <div>
          <form-checkbox
            class="system-note__skip"
            aria-describedby="selected"
            aria-controls="selected"
            @input="isSkip = $event"
          >
            {{ $t('modal.system_note.skip') }}
          </form-checkbox>
        </div>
        <div class="system-note__confirm">
          <base-button
            :full-width="true"
            color="primary"
            variants="contained"
            @click="handleConfirm"
          >
            {{ $t('modal.system_note.confirm') }}
          </base-button>
        </div>
      </div>
    </div>
  </b-modal>
</template>
<script>
import { MODAL } from '@/resources/modal'
import { mapActions, mapState } from 'vuex';
import { SKIP_SYSTEM_NOTE } from '@/api/user';
import { IS_SKIP_NOTE_BY_DEVICE } from '@/config/constant';
export default {
  components: {
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    FormCheckbox: () => import('~/components/common/forms/form-checkbox/index.vue')
  },
  props: {
    qrCodeUrl: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isLoaded: false,
      isSkip: false,
      MODAL
    }
  },
  computed: {
    ...mapState('user', ['user'])
  },
  methods: {
    ...mapActions('user', ['getInfoUser']),
    close () {
      this.$bvModal.hide(MODAL.SYSTEM_NOTE);
    },
    async handleConfirm () {
      if (this.isSkip) {
        await this.$axios.$put(SKIP_SYSTEM_NOTE);
        await this.getInfoUser();
      }
      this.$cookies.set(IS_SKIP_NOTE_BY_DEVICE, true);
      this.close();
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/modal/modal-system-note.scss">
</style>
