<template>
  <section class="profile">
    <picture>
      <source media="(max-width:576px)" :srcset="`/assets/images/components/desktop/end-user/${isDarkMode ? 'dark-mode-' : ''}profile-banner-mb.jpg`">
      <img
        class="profile__banner"
        :src="`/assets/images/components/desktop/end-user/${isDarkMode ? 'dark-mode-' : ''}profile-banner.jpg`"
        alt="profile-banner"
      >
    </picture>
    <div class="profile__avatar" @click="handleOpenEditAvatar">
      <img
        v-if="avatar"
        class="w-100 rounded-circle"
        :src="avatar"
        alt="avatar"
      >
      <span v-else>
        {{ firstCharNickName }}
      </span>
      <span v-if="enableEditAvatar" class="profile__edit-avatar">
        <span class="icon-edit" />
      </span>
    </div>
    <div class="profile__nickname">
      {{ nickName }}
    </div>
    <div class="profile__info">
      <div v-for="item in profileList" :key="item.key" :class="['profile__info-item', {'wallet-address': item.key === 'walletAddress'}]">
        <div class="profile__label">
          {{ item.label }}:
        </div>
        <div class="profile__content">
          <copy-to-clipboard v-if="item.key === 'walletAddress'" :id="profile[item.key]" :value-copy="profile[item.key]">
            <template v-if="$device.isMobile">
              {{ profile[item.key] | formatHash }}
            </template>
            <template v-else>
              {{ profile[item.key] }}
            </template>
          </copy-to-clipboard>
          <div v-else>
            {{ formatContent(item) }}
          </div>
        </div>
      </div>
    </div>
    <client-only>
      <modal-change-avatar
        :avatar-list="avatarList"
        :prefix-link="user.prefixAvatarLink"
        @on-submit="updateAvatar"
      />
    </client-only>
  </section>
</template>
<script>
import { getAvatar } from '@/helper/avatar-util';
import USER_API from '@/api/user'
import dayjs from 'dayjs';
import { USER_ROLE, DIFF_DATE_FORMAT } from '@/config/constant';
import darkMModeMixin from '@/mixins/dark-mode.js';
import { mapActions, mapState } from 'vuex';
import { MODAL } from '@/resources/modal';
import { USER_AVATAR_MAX_NUMBER } from '@/constants/image-paths';
import { CONFIRM_TYPE } from '@/resources/message';
export default {
  components: {
    CopyToClipboard: () =>
      import('~/components/common/copy-to-clipboard/index.vue'),
    ModalChangeAvatar: () => import('~/components/common/modal/modal-change-avatar.vue')
  },
  mixins: [darkMModeMixin],
  data () {
    return {
      profile: {},
      profileList: [
        {
          label: this.$t('common.wallet_address'),
          key: 'walletAddress',
          type: 'string',
          class: 'wallet-address'
        },
        {
          label: this.$t('end_user.created_at'),
          key: 'createdAt',
          type: 'date'
        },
        {
          label: this.$t('end_user.last_login_at'),
          key: 'lastLoginAt',
          type: 'date'
        },
        {
          label: this.$t('end_user.last_trade_at'),
          key: 'lastBuySellOrder',
          type: 'date'
        }
      ],
      avatarList: []
    }
  },
  computed: {
    ...mapState('user', ['user']),
    nickName () {
      return this.profile.nickName || this.profile.walletAddress;
    },
    avatar () {
      return getAvatar(this.user?.avatar, this.user?.type);
    },
    firstCharNickName () {
      return this.profile?.nickName
        ? this.nickName?.charAt(0)
        : this.nickName?.charAt(3);
    },
    enableEditAvatar () {
      return USER_ROLE.USER === this.user?.type;
    }
  },
  mounted () {
    this.getUserInfo()
    this.avatarList = Array.from({ length: (USER_AVATAR_MAX_NUMBER) }, (_, i) => 'avatar_' + (i + 1))
  },
  methods: {
    ...mapActions('modal-response', ['showResponseModal']),
    ...mapActions('user', ['setUser']),
    formatContent (item) {
      if (!this.profile[item.key]) {
        return '--'
      }
      if (item.type === 'date') {
        return dayjs(this.profile[item.key]).format(DIFF_DATE_FORMAT)
      }
      return this.profile[item.key]
    },
    async getUserInfo () {
      try {
        const { data } = await this.$axios.$get(USER_API.PROFILE)
        if (data) {
          if (data.lastBuyOrder && data.lastSellOrder) {
            data.lastBuySellOrder = dayjs(data.lastBuyOrder).isAfter(data.lastSellOrder) ? data.lastBuyOrder : data.lastSellOrder
          } else {
            data.lastBuySellOrder = data.lastBuyOrder || data.lastSellOrder
          }
          this.profile = data
        }
      } catch (error) {
        console.error(error);
      }
    },
    async updateAvatar (avatar) {
      try {
        await this.$axios.$put(USER_API.UPDATE_AVATAR, {
          avatar
        })
        this.setUser({
          ...this.user,
          avatar
        })
      } catch (error) {
        this.showResponseModal({
          title: this.$t('role_management.avatar.error.title'),
          content: this.$t('role_management.form_edit.description_failure'),
          icon: '/assets/images/common/response/avatar_used.svg',
          confirmAction: this.$t('action.confirm'),
          confirmActionType: CONFIRM_TYPE.CLOSE,
          show: true,
          thumbClass: 'thumb--sm'
        });
        return;
      } finally {
        this.$bvModal.hide(MODAL.CHANGE_AVATAR);
      }
    },
    handleOpenEditAvatar () {
      if (this.enableEditAvatar) {
        this.$bvModal.show(MODAL.CHANGE_AVATAR);
      }
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/user/profile/index.scss" />
