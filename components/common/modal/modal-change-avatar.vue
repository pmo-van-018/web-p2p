<template>
  <modal-common
    :id="modalName"
    :ref="modalName"
    :title="$t('role_management.avatar.title')"
    @hide-modal="closed"
  >
    <div class="avatar__content">
      <div class="avatar__selected">
        <img
          v-if="avatarSrc"
          :src="avatarSrc"
          alt="icon"
        >
        <img v-else src="/assets/images/common/select-avatar.svg" alt="icon">
      </div>
      <template
        v-if="prefixLink"
      >
        <div class="avatar__list">
          <img class="avatar__item" src="/assets/images/common/empty-avatar.svg" alt="empty" @click="setSelectedAvatar(null)">
          <img
            v-for="item in avatarList"
            :key="item"
            :class="['avatar__item', { selected: selectedAvatar === item }]"
            :src="getAvatarSrc(item)"
            alt="item"
            loading="lazy"
            @click="setSelectedAvatar(item)"
          >
        </div>
      </template>
      <div class="avatar__action">
        <base-button
          variants="contained"
          full-width
          color="info"
          @click="closed"
        >
          {{ $t('action.close') }}
        </base-button>
        <base-button
          variants="contained"
          full-width
          color="primary"
          @click="submit"
        >
          {{ $t('role_management.avatar.submit') }}
        </base-button>
      </div>
    </div>
  </modal-common>
</template>
<script>
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import { MODAL } from '@/resources/modal'
import { mapState } from 'vuex';
import { getAvatar } from '@/helper/avatar-util';
export default {
  components: {
    ModalCommon,
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    prefixLink: {
      type: String,
      default: ''
    },
    avatarList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      MODAL,
      modalName: MODAL.CHANGE_AVATAR,
      selectedAvatar: null
    }
  },
  computed: {
    ...mapState('user', ['user']),
    avatarSrc () {
      return getAvatar(this.selectedAvatar, this.user?.type)
    }
  },
  mounted () {
    this.selectedAvatar = this.user?.avatar
  },
  methods: {
    getAvatar,
    getAvatarSrc (avatar) {
      return getAvatar(avatar, this.user?.type)
    },
    setSelectedAvatar (avatar) {
      this.selectedAvatar = avatar
    },
    closed () {
      this.setSelectedAvatar(this.user?.avatar)
      this.$bvModal.hide(MODAL.CHANGE_AVATAR);
    },
    submit () {
      this.$emit('on-submit', this.selectedAvatar)
    }
  }
}
</script>
<style lang="scss" scoped>
.avatar {
  &__selected {
    padding: 12px;
    border-radius: 50%;
    position: relative;
    &:after {
      content: "";
      position: absolute;
      border: 2px dashed #E8E9EF;
      top: -1px;
      bottom: -1px;
      left: -1px;
      right: -1px;
      border-radius: inherit;
    }
    img {
      width: 130px;
      height: 130px;
      border-radius: 100%;
    }
  }
  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    margin-top: 24px;
    text-align: center;
  }
  &__list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    gap: 24px 5%;
    max-height: 268px; // (3rows x 56px) + (3 x gap 24px) + 56px / 2
    overflow-y: auto;
    @include scrollbars(3px, #E2E4EB, #fff);
    &::after {
      content: "";
      flex: auto;
    }
  }
  &__item {
    width: 56px;
    height: 56px;
    border-radius: 100%;
    transition: all 0.1s ease-in-out;
    cursor: pointer;
    &.selected {
      border: 3px solid #A2A6B4;
    }
  }
  &__action {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    width: 100%;
  }
}
</style>
