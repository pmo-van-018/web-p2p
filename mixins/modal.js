import { MODAL } from '@/resources/modal'

export default {
  methods: {
    $_modalMixin_closeModal (id) {
      this.$root.$emit('bv::hide::modal', id)
    },
    $_modalMixin_openModal (id) {
      this.$root.$emit('bv::show::modal', id)
    },
    $_modalMixin_toggleModal (id) {
      this.$root.$emit('bv::toggle::modal', id)
    },
    $_modalMixin_closeAllModal () {
      const self = this
      Object.values(MODAL).forEach(function (item) {
        self.$_modalMixin_closeModal(item)
      })
    },
    $_modalMixin_closeExceptModal (id) {
      const self = this
      Object.values(MODAL).forEach(function (item) {
        if (item !== id) {
          self.$_modalMixin_closeModal(item)
        }
      })
    }
  }
}
