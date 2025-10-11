/* eslint-disable no-console */
import { ethers, utils } from 'ethers'
import { SiweMessage } from 'siwe'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import walletMixin from '@/mixins/open-wallet.js'
import { MODAL } from '@/resources/modal'
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isEmpty from 'lodash/isEmpty';
import {
  USER_STATUS,
  NAME_EVENT_WS_JOIN,
  NAME_EVENT_WS_LISTEN,
  IS_SKIP_NOTE_BY_DEVICE,
  USER_ROLE, LOGIN_TYPE_ROLE,
  NAME_EVENT_WS_HEART_BEAT, WS_HEART_BEAT_INTERVAL_TIME
} from '@/config/constant'
import find from 'lodash/find';
import { events } from '@/constants/socket-events';
import { BUY_ORDER_STEPS } from '@/constants/orders';
import { CONFIRM_TYPE, RESPONSE_ICON } from '@/resources/message'
import { TWO_FACTOR_AUTH_STATUS } from '@/constants/2fa';
import { getSessionKey } from '../helper/session'
import modalMixin from '~/mixins/modal'
import web3OnboardMixin from '~/mixins/web3-onboard'

dayjs.extend(utc);

export default {
  mixins: [walletMixin, modalMixin, web3OnboardMixin],
  data () {
    return {
      checkLoginInterval: null,
      checkSignInterval: null,
      heartBeatInterval: null,
      provider: null,
      isLogoutLoading: false,
      isShowCfVerify: false,
      cfToken: '',
      modalCfTurnstile: 'ModalCfTurnstileHeader'
    }
  },
  computed: {
    ...mapState('user', ['user', 'lockedUserData']),
    ...mapGetters('resources', ['networkConfigs']),
    ...mapState({
      reporterInfo: state => state.reporter.user
    }),
    isRoleUser () {
      return this.user?.type === USER_ROLE.USER
    },
    chainIdSignMessage () {
      return this.networkConfigs?.Polygon?.chainId || this.$config.CHAIN_ID_SIGN_MESSAGE
    }
  },
  beforeDestroy () {
    clearInterval(this.checkLoginInterval)
    clearInterval(this.checkSignInterval)
    clearInterval(this.heartBeatInterval)
  },
  methods: {
    ...mapMutations('user', ['SET_USER']),
    ...mapActions('modal-response', ['showResponseModal']),
    ...mapActions('user', ['getInfoUser', 'setIconNetwork', 'setStatusUserSocket', 'setIsLoadingIconNetwork']),
    ...mapActions('auth', ['challenge', 'login', 'logout', 'loginOperation', 'loginAdmin']),
    ...mapActions('statistics', ['setStatistic']),
    ...mapActions('end-user', ['setBuyInfo']),
    ...mapActions('chat', ['setOrder']),
    ...mapActions('chat-support-request', ['resetStateChat']),
    ...mapActions('chat-support-request', ['setResolveSupportRequest']),
    ...mapActions('2fa', ['setOtpProcessing']),
    ...mapActions({
      setReporterUser: 'reporter/setUser'
    }),
    async $_authMixin_onConnectUserWallet () {
      if (this.$device.isMobileOrTablet) {
        await this.$_authMixin_connect()
        return
      }
      if (!this.cfToken) {
        this.$bvModal.show(MODAL.CF_TURNSTILE)
        this.isShowCfVerify = true
        return
      }
      await this.$_authMixin_connect()
    },
    async $_authMixin_connect (loginType) {
      loginType = loginType || LOGIN_TYPE_ROLE.USER;
      const wallets = await this.$_web3Onboard_connectWallet()
      try {
        if (wallets && wallets.length) {
          const address = wallets[0].accounts[0].address.startsWith('0x') ? ethers.utils.getAddress(wallets[0].accounts[0].address) : wallets[0].accounts[0].address;
          const challenge = await this.challenge(loginType);
          const nonce = challenge?.nonce
          const message = await this.$_authMixin_getMessageSign(address, nonce)
          const ethersProvider = new ethers.providers.Web3Provider(
            wallets[0].provider,
            'any'
          )
          const isTron = wallets[0].label === 'Tron Wallet';
          let sign;
          if (isTron) {
            this.$bvModal.show(MODAL.SIGN_NONCE)
            sign = await window.tronWeb.trx.signMessageV2(message)
          } else {
            const signer = ethersProvider.getSigner()
            this.$bvModal.show(MODAL.SIGN_NONCE)
            sign = await signer.signMessage(message)
            sign = utils.hexlify(sign, {
              allowMissingPrefix: true,
              hexPad: 'left'
            })
          }
          let result = null
          const loginPayload = {
            message,
            signature: sign,
            loginType: window.isSignV1 && window.tron && isTron ? 'Tron Wallet V1' : wallets[0].label,
            cfToken: this.cfToken
          };
          if (this.$_validOperationAccount(loginType)) {
            result = await this.loginOperation(loginPayload);
          } else if (this.$_validAdminAccount(loginType)) {
            result = await this.loginAdmin(loginPayload);
          } else {
            result = await this.login(loginPayload);
          }
          if (result && result.success) {
            window.localStorage.setItem(
              'connectedWallets',
              JSON.stringify(wallets.map(({ label }) => label))
            )
            this.$bvModal.hide(MODAL.SIGN_NONCE)
            if (result.twoFactorAuth?.totpStatus === TWO_FACTOR_AUTH_STATUS.ENABLED && !result.twoFactorAuth?.verified) {
              await this.setOtpProcessing(true)
              this.$bvModal.show(MODAL.LOGIN_2FA)
              return;
            }
            window.location.reload()
          }
        }
      } catch (e) {
        console.error(e)
        window.localStorage.setItem('skipRedirect', '1')
        this.$bvModal.hide(MODAL.SIGN_NONCE)
        this.$_authMixin_showPopupUserRejectConnect()
        await this.$_web3Onboard_disconnectWallet()
        const key = e.response?.data?.errors?.[0]?.key || ''
        if (key === 'FORBIDDEN_ERROR' || key === 'FORBIDDEN') {
          this.showResponseModal({
            title: this.$t('modal.title.connect_wallet'),
            content: this.$t('modal.content.connected_failed'),
            description: this.$t('modal.message.AUTHENTICATE_FORBIDDEN'),
            icon: RESPONSE_ICON.CONNECT_ERROR_WALLET,
            show: true,
            preventClose: false
          })
        }
      }
    },
    onCfChallengeResultLogin (token, loginType = '') {
      this.cfToken = token
      this.isShowCfVerify = false
      if (this.$device.isMobileOrTablet && !this.user) {
        this.$_authMixin_connect(loginType)
        return
      }
      if (token && !this.user) {
        this.$_authMixin_connect(loginType)
      }
    },
    $_authMixin_onSetChainChangedNetwork () {
      if (process.client && window.ethereum) {
        window.ethereum.on('chainChanged', (chainId) => {
          const networkConfig = find(this.networkConfigs, function (network) {
            return ethers.utils.hexValue(Number(network.chainId)) === chainId
          })
          if (!!networkConfig && !!chainId) {
            this.setIconNetwork(networkConfig.iconNetwork)
          } else {
            this.setIconNetwork('')
          }
        })
      }
    },
    async $checkDisconnectedSession () {
      if (this.user) {
        const storedWalletType = window.localStorage.getItem('connectedWallets')
        if (!storedWalletType) { return; }

        const previouslyConnectedWallets = JSON.parse(storedWalletType)
        const previouslyConnectedWallet = previouslyConnectedWallets?.[0]

        if (
          !previouslyConnectedWallet ||
          (previouslyConnectedWallet !== 'WalletConnect' &&
            previouslyConnectedWallet !== 'Binance')
        ) {
          return;
        }

        try {
          await this.$_web3Onboard_connectWallet({
            autoSelect: { label: previouslyConnectedWallet, disableModals: true }
          })
          const wallets = this.stateWallet // computed in mixins web3Onboard

          // on reloading: session got timeout before
          if (wallets.length === 0) {
            await this.$_authMixin_logout();
            return;
          }

          if (previouslyConnectedWallet === 'WalletConnect') {
            // on reloading: session still alive then subscribe disconnect event (wallet connect)
            wallets[0].provider.on('accountsChanged', async (accounts) => {
              if (accounts.length === 0) {
                await this.$_authMixin_logout();
              }
            })
          }
          if (previouslyConnectedWallet === 'Binance') {
            // on reloading: session still alive then subscribe disconnect event (binance)
            wallets[0].provider.on('disconnect', async () => {
              await this.$_authMixin_logout();
            });
          }
        } catch (error) {
          // when session disconnected and user close the popup
          await this.$_authMixin_logout();
        }
      }
    },
    async $_authMixin_checkCurrentAccount () {
      try {
        if (this.user) {
          const previouslyConnectedWallets = JSON.parse(
            window.localStorage.getItem('connectedWallets')
          )
          const wallets = this.stateWallet
          if (!wallets.length && previouslyConnectedWallets && previouslyConnectedWallets.length) {
            await this.$_web3Onboard_connectWallet({
              autoSelect: { label: previouslyConnectedWallets[0], disableModals: true }
            })
          }
          const [primaryWallet] = this.web3Onboard.state.get().wallets
          const chainId = primaryWallet?.chains[0]?.id || ''
          const config = find(this.networkConfigs, function (network) {
            return ethers.utils.hexValue(Number(network.chainId)) === chainId
          })
          if (!!config && !!chainId) {
            this.setIconNetwork(config.iconNetwork)
          } else {
            this.setIconNetwork('')
          }
          this.setIsLoadingIconNetwork(false)
        }
      } catch (error) {
        this.setIsLoadingIconNetwork(false)
        console.error('Fail to check current account', error)
      }
    },
    async $_authMixin_onCloseSignNonce () {
      await this.$_web3Onboard_disconnectWallet()
      this.$cookies.remove('connect.sid')
      this.$cookies.remove('user')
      this.$cookies.remove(getSessionKey(window.location.host, this.$config))
      this.$cookies.remove(IS_SKIP_NOTE_BY_DEVICE)
      this.$_authMixin_clearLocalStorage()
    },
    async $_authMixin_logout (isCallLogoutApi = true) {
      try {
        const skipRedirect = localStorage.getItem('skipRedirect');
        this.isLogoutLoading = true
        await this.$_web3Onboard_disconnectWallet()
        if (isCallLogoutApi) {
          await this.logout();
        }
        if (this.reporterInfo) {
          this.$cookies.remove('connect.sid');
          this.$cookies.remove('user');
          this.setReporterUser(null);
          this.$cookies.remove(getSessionKey(window.location.host, this.$config));
          this.$router.push('/')
        } else {
          if (this.$socketChat) {
            this.$socketChat.disconnect()
          }
          this.$cookies.remove('connect.sid');
          this.$cookies.remove('user');
          this.$cookies.remove(getSessionKey(window.location.host, this.$config));
          this.$cookies.remove(IS_SKIP_NOTE_BY_DEVICE);
          if (this.isRoleUser) {
            this.setBuyInfo(null)
          }
          this.SET_USER(null);
          this.setStatusUserSocket(null);
          this.$_authMixin_clearLocalStorage()
          if (!skipRedirect) {
            this.$router.push('/')
            this.resetStateChat()
          }
        }
      } catch (error) {
      } finally {
        this.isLogoutLoading = false
      }
    },
    async $_authMixin_getMessageSign (address, nonce) {
      const isEther = address.startsWith('0x');
      const chainId = isEther ? this.chainIdSignMessage : await this.$getTronChain();
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: this.$config.STATEMENT_SIWE,
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce
      });
      let msg = message.prepareMessage();
      msg = msg.replace('wants you to sign in with your Ethereum account', 'wants you to sign in with your account');
      msg = isEther ? msg : msg.replace(/Chain ID: \d+/, `Chain ID: ${chainId}`);
      return msg;
    },

    // References: https://github.com/tronprotocol/tronwallet-adapter/blob/main/packages/adapters/tronlink/src/adapter.ts
    async $getTronChain () {
      try {
        const { blockID = '' } = await window.tronWeb.trx.getBlockByNumber(0);
        return `0x${blockID.slice(-8)}`;
      } catch (err) {
        return '';
      }
    },
    $_authMixin_showPopupUserRejectConnect () {
      if (!isEmpty(this.lockedUserData) || this.lockedUserData) {
        return;
      }
      this.showResponseModal({
        title: this.$t('modal.title.connect_wallet'),
        content: this.$t('modal.content.connected_failed'),
        description: this.$t('modal.message.error_system'),
        icon: RESPONSE_ICON.CONNECT_ERROR_WALLET,
        show: true,
        preventClose: false
      })
    },
    $_authMixin_checkShowSystemNote () {
      const userInfo = this.$store.state?.user?.user;

      // Skip if the current user is not an end-user
      if (userInfo?.type !== USER_ROLE.USER) {
        return;
      }
      const isExpSkipTime = userInfo?.skipNoteAt
        ? dayjs().utc().diff(dayjs(userInfo?.skipNoteAt), 'day') > 30
        : true;

      const isSkipNoteByDevice = this.$cookies.get(IS_SKIP_NOTE_BY_DEVICE) || false;
      if (isExpSkipTime && !isSkipNoteByDevice) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.$bvModal.show(MODAL.SYSTEM_NOTE);
          }, 2000)
        })
      }
    },
    $_authMixin_clearLocalStorage () {
      Object.keys(localStorage).forEach((key) => {
        // Because Coinbase need keep --walletlink:* in localStorage for next login with Coinbase Wallet
        // otherwises, it will show popup to ask user to submit phone code. So we need to keep it
        if (!key.startsWith('-walletlink:')) {
          localStorage.removeItem(key);
        }
      });
    },
    async $_authMixin_onCloseWarningLogout () {
      await this.$_authMixin_logout(false);
    },
    $_authMixin_onSocket () {
      if (this.user?.walletAddress && this.$socket) {
        this.$socket.client.emit(NAME_EVENT_WS_JOIN, this.user.walletAddress);
        this.$socket.client.on(NAME_EVENT_WS_LISTEN, this.$_authMixin_handleSocketEvent);
        this.heartBeatInterval = setInterval(() => {
          this.$socket.client.emit(NAME_EVENT_WS_HEART_BEAT);
        }, WS_HEART_BEAT_INTERVAL_TIME)
      }
    },
    $_authMixin_offSocket () {
      if (this.user?.walletAddress && this.$socket) {
        this.$socket.client.off(NAME_EVENT_WS_LISTEN);
      }
    },
    $_authMixin_handleSocketEvent (message) {
      const data = JSON.parse(message);
      if (data.event === events.objects.order) {
        this.setBuyInfo(data)
        if (this.isRoleUser) {
          this.setOrder(data)
        }
        if ([BUY_ORDER_STEPS.BUY_SENDING_CRYPTO_SUCCESS].includes(data.step)) {
          this.$_modalMixin_closeAllModal()
        }
      }
      if (data.action === events.actions.appeal.adminCancelAppealSession &&
        this.userType === USER_ROLE.ADMIN_SUPPORTER &&
        this.$route.name === 'appeal-detail' &&
        this.$route.query?.appealId === data?.appealId
      ) {
        this.showResponseModal({
          title: '',
          content: '',
          description: this.$t('modal.message.PERMISSION_DENIED_TO_UPDATE_APPEAL'),
          icon: RESPONSE_ICON.CANCELLED_APPEAL_FAILED,
          show: true,
          preventClose: true,
          visibleClose: false,
          confirmAction: this.$t('action.confirm'),
          confirmActionType: CONFIRM_TYPE.REDIRECT_APPEAL_LIST_SUPPORTER
        })
      }
      switch (data?.action) {
        case events.actions.user.deactivated:
          this.setStatusUserSocket(USER_STATUS.INACTIVE);
          this.$bvModal.show(MODAL.WARNING_LOGOUT);
          break;

        case events.actions.user.deleted:
          this.setStatusUserSocket(USER_STATUS.DELETED);
          this.$bvModal.show(MODAL.WARNING_LOGOUT);
          break;
        case events.actions.user.statistic:
          this.setStatistic(data)
          break
        case events.actions.supportRequest.resolvedSupportRequest:
          this.setResolveSupportRequest(true)
          break;
        case events.actions.user.blocked:
          this.$_authMixin_logout(false)
          break
        default:
          break;
      }
    },
    $_validOperationAccount (loginType) {
      return typeof (loginType) === 'string' && loginType === LOGIN_TYPE_ROLE.OPERATION && window.location.host.includes(this.$config.OPERATION_PREFIX);
    },
    $_validAdminAccount (loginType) {
      return typeof (loginType) === 'string' && loginType === LOGIN_TYPE_ROLE.ADMIN && window.location.host.includes(this.$config.ADMIN_PREFIX);
    }
  }
};
