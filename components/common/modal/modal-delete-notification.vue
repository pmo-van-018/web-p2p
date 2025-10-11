<template>
  <ModalCommon
    :id="MODAL.Delete_Noti"
    :ref="MODAL.Delete_Noti"
    :title="getTitle"
  >
    <div class="delete-noti">
      <img class="delete-noti__icon" :src="require('~imageRoot/common/notification/delete.svg')" alt="icon delete" />
      <div class="delete-noti__des">{{ $t('notification.modalDelete.noted') }}</div>
      <base-button variants="contained" color="primary" full-width @click="NotificationDelete">
        {{ $t('notification.modalDelete.button') }}
      </base-button>
    </div>
  </ModalCommon>
</template>
<script>
import ModalCommon from '@/components/desktop/modal/modal-common.vue'
import { MODAL } from '@/resources/modal.js'
import NOTIFICATION_API from '@/api/notification'

export default {
  components: {
    ModalCommon,
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  data () {
    return {
      MODAL,
      delete: ''
    }
  },
  computed: {
    getTitle () {
      return this.$t('notification.modalDelete.title')
    }
  },
  methods: {
    async NotificationDelete () {
      const res = await this.$axios.$delete(`${NOTIFICATION_API.NOTIFICATION_DELETE_ALL}`)
      this.delete = res.errors || {}
      this.$emit('delete-notification')
      this.$bvModal.hide(MODAL.Delete_Noti)
    }
  }
}
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/modal/modal-delete-notification.scss"></style>
