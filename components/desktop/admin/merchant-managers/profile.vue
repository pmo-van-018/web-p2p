<template>
  <section class="profile-wallet-address">
    <div class="profile-wallet-address__wrapper">
      <div class="profile-wallet-address__head">
        <div v-if="isFirstLoading" class="p-3">
          <b-skeleton-img height="140px" no-aspect></b-skeleton-img>
        </div>
        <profile-information
          v-else
          :profile-information="profileInformation"
          :is-loading="isProfileInformationLoading"
          @on-refresh="getProfileInformationMerchantManagerById"
        />
      </div>
      <div class="profile-wallet-address__container" :class="{ 'center': isInActive }">
        <wallet-addresses
          class="w-100"
          :profile-information="profileInformation"
          :wallet-addresses="walletAddressManagements"
          :is-list-loading="isProfileInformationLoading || isWalletListLoading"
          :is-first-loading="isFirstLoading"
          @on-refresh-wallet="onRefreshChangeWalletAddress"
          @on-update-active-wallet="onRefreshActiveWalletAddress"
        />
      </div>
    </div>
  </section>
</template>
<script>
import { MERCHANT_MANAGER_BY_ID } from '@/api/merchant-manager';
import { LIST_WALLET_ADDRESSES } from '@/api/wallet-address';
import isEmpty from 'lodash/isEmpty';
import { mapActions, mapState } from 'vuex';
import { USER_ROLE, USER_STATUS } from '@/config/constant';

export default {
  components: {
    ProfileInformation: () => import('~/components/desktop/merchant-manager/profile/index.vue'),
    WalletAddresses: () => import('~/components/desktop/merchant-manager/wallet-addresses/index.vue')
  },
  data () {
    return {
      profileInformation: null,
      isProfileInformationLoading: false,
      isFirstLoading: false,
      isWalletListLoading: false,
      walletAddressManagements: []
    }
  },
  computed: {
    ...mapState('user', ['user']),
    isMerchantManager () {
      return this.user?.type === USER_ROLE.MERCHANT_MANAGER
    },
    isSupperAdmin () {
      return this.user?.type === USER_ROLE.SUPER_ADMIN
    },
    isInActive () {
      return this.profileInformation?.status === USER_STATUS.INACTIVE
    }
  },
  async created () {
    this.isFirstLoading = true
    if (this.isSupperAdmin) {
      await this.getProfileInformationMerchantManagerById()
    }
    if (this.isMerchantManager) {
      await this.getListWalletAddresses()
    }
    this.isFirstLoading = false
  },
  methods: {
    ...mapActions(['getCurrentOperationInfo']),
    async onRefreshChangeWalletAddress () {
      if (this.isSupperAdmin) {
        await this.getProfileInformationMerchantManagerById()
      }
      if (this.isMerchantManager) {
        await this.getListWalletAddresses()
      }
    },
    async onRefreshActiveWalletAddress () {
      if (this.isSupperAdmin) {
        await this.getProfileInformationMerchantManagerById()
      }
    },
    async getProfileInformationMerchantManagerById () {
      try {
        this.isProfileInformationLoading = true
        const res = await this.$axios.$get(MERCHANT_MANAGER_BY_ID(this.$route.params.id));
        if (!isEmpty(res?.data)) {
          this.profileInformation = {
            ...res.data,
            isChangeStatus: true,
            isDeleteProfile: true
          }
          this.walletAddressManagements = this.profileInformation?.walletAddressManagements || []
        }
      } catch (error) {
        /* eslint-disable no-console */
        console.error(error);
        this.$router.replace('/404')
      } finally {
        this.isProfileInformationLoading = false
      }
    },
    async getListWalletAddresses () {
      try {
        this.isWalletListLoading = true
        const { data } = await this.$axios.$get(LIST_WALLET_ADDRESSES);
        this.walletAddressManagements = data?.items || []
        this.profileInformation = {
          ...this.user,
          isChangeStatus: false,
          isDeleteProfile: false
        }
      } catch (error) {
        /* eslint-disable no-console */
        console.error(error);
      } finally {
        this.isWalletListLoading = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.profile-wallet-address {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: calc(100vh - 80px);
  height: 100%;
  &__wrapper {
    min-height: inherit;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  &__container {
    padding: 1rem;
    height: 100%;
    display: flex;
    justify-content: center;
    flex: 1;
    &.center {
      align-items: center;
    }
  }
  @media (min-width: 1300px) {
    &__container {
      padding: 1rem;
    }
  }
  @media (min-width: 1600px) {
    gap: 2rem;
    &__container {
      padding: 17px 38px;
    }
  }
}
</style>
