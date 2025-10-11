/* eslint-disable no-unused-vars */
import { ProviderIdentityFlag, ProviderLabel } from '@web3-onboard/injected-wallets/dist/types'
import injectedModule from '@web3-onboard/injected-wallets'
import coinbaseWalletModule from '@web3-onboard/coinbase'
import Onboard from '@web3-onboard/core'
import { mapActions, mapGetters, mapState } from 'vuex'
import { MODAL } from '@/resources/modal'
import binanceModule from '@binance/w3w-blocknative-connector'
import { WALLET_SUPPORTED } from '@/resources/maintenance';
import walletConnectModule from '@web3-onboard/walletconnect'
import TronProvider from './tron/tronlink'
import { getConfig } from '~/helper/walletconnect'
import { openLink } from '~/helper'

export default {
  data () {
    return {
      walletConnectConfig: null,
      firstInitWallet: true
    }
  },
  computed: {
    ...mapState('web3-onboard', ['web3Onboard']),
    ...mapState('maintenance', ['walletMaintenance']),
    ...mapState('user', ['user']),
    ...mapGetters('resources', ['networkConfigs']),
    stateWallet () {
      return this.web3Onboard?.state?.get()?.wallets
    },
    isVisibleWarningTrustWallet () {
      return this.firstInitWallet && !this.walletMaintenance?.includes(WALLET_SUPPORTED.TRUSTWALLET) && !this.$device.isFirefox
    }
  },
  methods: {
    ...mapActions('web3-onboard', ['setWeb3Onboard']),
    openDeepLink ({ url, ios, android }) {
      openLink(url)
      window.localStorage.setItem('appLink', this.$device.isIos ? ios : android)
      this.$bvModal.show(MODAL.WALLET_APP_STORE)
    },
    _dynamicImportWalletWithMaintenance () {
      const metamaskConnect = () => {
        return {
          label: ProviderLabel.MetaMask,
          getIcon: async () => (await import('@web3-onboard/injected-wallets/dist/icons/metamask.js')).default,
          checkProviderIdentity: ({ provider }) => !!provider && !!provider[ProviderIdentityFlag.MetaMask],
          getInterface: ({ EventEmitter, chains }) => {
            if (!window.ethereum || !window.ethereum.isMetaMask) {
              if (this.$device.isMobileOrTablet) {
                openLink(`https://metamask.app.link/dapp/${this.walletConnectConfig.dappUrl}`)
                throw new Error(this.$t('web3.connect.connecting-wallet.mb-warning'))
              } else {
                window.open('https://metamask.io/download/', '_blank').focus()
                throw new Error(this.$t('web3.connect.connecting-wallet.pc-warning'))
              }
            }
          }
        }
      }
      const trustConnect = () => {
        return {
          label: 'Trust Wallet',
          getIcon: async () => (await import('@web3-onboard/trust/dist/icon.js')).default,
          getInterface: () => {
            // check if trust is injected into window.ethereum
            if (window.ethereum?.isTrust) {
              return { provider: window.ethereum };
            }
            if (window.trustwallet) {
              // directly use the window.trustwallet injection
              return { provider: window.trustwallet };
            }
            // trustwallet extension is not installed
            // send user to install page
            if (this.$device.isMobileOrTablet) {
              if (/Android/i.test(navigator.userAgent) && this.user) { return }
              this.openDeepLink({
                // goto https://link.trustwallet.com/open_url?coin_id=60&url=https://p2p.nevel.tech and inspect function updateURL()
                url: `trust://open_url?coin_id=60&url=${this.walletConnectConfig?.dappUrl}`,
                ios: 'https://apps.apple.com/app/apple-store/id1288339409',
                android: 'https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp'
              })
              throw new Error(this.$t('web3.connect.connecting-wallet.trust-mb-warning'))
            } else {
              window.open('https://trustwallet.com/browser-extension', '_blank');
              throw new Error(this.$t('web3.connect.connecting-wallet.trust-pc-warning'))
            }
          }
        };
      }
      const coinbaseWalletConnect = coinbaseWalletModule({ darkMode: true })
      const binanceWallet = binanceModule({ options: { lng: 'en' } })
      const tronConnect = () => {
        return {
          label: 'Tron Wallet',
          getIcon: async () => (await import('./tron/icon')).default,
          getInterface: () => {
            if (window.tronWeb) {
              return { provider: new TronProvider().getOnboardProvider() };
            }
            if (this.$device.isMobileOrTablet) {
              if (!window.v99) {
                // https://docs.tronlink.org/tronlink-app/deeplink/open-dapp
                const params = {
                  url: this.walletConnectConfig.dappUrl,
                  // TODO: Known Issue can not open deeplink if app not running background
                  // action: 'open',
                  protocol: 'tronlink',
                  version: '1.0'
                }
                const url = this.$device.isIos ? `tronlinkoutside://pull.activity?param=${encodeURIComponent(JSON.stringify(params))}` : 'tronlink://'
                this.openDeepLink({
                  url,
                  ios: 'https://itunes.apple.com/us/app/tronlink/id1453530188',
                  android: 'https://play.google.com/store/apps/details?id=com.tronlinkpro.wallet'
                })
                throw new Error(this.$t('web3.connect.connecting-wallet.tron-mb-warning'))
              }
            } else {
              window.open('https://www.tronlink.org/dlDetails/', '_blank').focus()
              throw new Error(this.$t('web3.connect.connecting-wallet.tron-pc-warning'))
            }
          }
        };
      }
      // const walletConnectModule = (await import('@web3-onboard/walletconnect/dist/index.js')).default
      const walletConnect = walletConnectModule({
        version: 2,
        projectId: this.walletConnectConfig?.projectId,
        optionalChains: [5, 137, 56],
        requiredChains: [1],
        dappUrl: this.walletConnectConfig?.dappUrl,
        qrModalOptions: {
          themeVariables: {
            '--wcm-z-index': '1042'
          }
        }
      })
      const providerLabelWallet = {
        [WALLET_SUPPORTED.METAMASK]: ProviderLabel.MetaMask,
        [WALLET_SUPPORTED.TRUSTWALLET]: ProviderLabel.Trust,
        [WALLET_SUPPORTED.COINBASE]: ProviderLabel.Coinbase,
        [WALLET_SUPPORTED.TRONLINK]: 'Tron Wallet',
        [WALLET_SUPPORTED.BINANCE]: ProviderLabel.Binance,
        [WALLET_SUPPORTED.WALLETCONNECT]: 'Wallet connect'
      }
      const providerLabelWalletFirefox = {
        [WALLET_SUPPORTED.METAMASK]: ProviderLabel.MetaMask,
        [WALLET_SUPPORTED.COINBASE]: ProviderLabel.Coinbase,
        [WALLET_SUPPORTED.BINANCE]: ProviderLabel.Binance,
        [WALLET_SUPPORTED.WALLETCONNECT]: 'Wallet connect'
      }
      const providerLabel = this.$device.isFirefox ? providerLabelWalletFirefox : providerLabelWallet
      const walletMaintenanceMapping = this.walletMaintenance.length === 0 ? providerLabel : this.walletMaintenance.reduce((acc, wallet) => {
        const label = providerLabel[wallet];
        acc[label] = false;
        return acc;
      }, {});
      const injected = injectedModule({
        filter: {
          [ProviderLabel.Detected]: false,
          ...walletMaintenanceMapping
        }
      })
      const walletConnectMethods = [
        { key: WALLET_SUPPORTED.METAMASK, method: metamaskConnect },
        { key: WALLET_SUPPORTED.TRUSTWALLET, method: trustConnect },
        { key: WALLET_SUPPORTED.COINBASE, method: coinbaseWalletConnect },
        { key: WALLET_SUPPORTED.TRONLINK, method: tronConnect },
        { key: WALLET_SUPPORTED.BINANCE, method: binanceWallet },
        { key: WALLET_SUPPORTED.WALLETCONNECT, method: walletConnect }
      ];

      const availableWallets = walletConnectMethods
        .filter(({ key }) => {
          return walletMaintenanceMapping[providerLabel[key]] === undefined && providerLabel[key] // if undefined, wallets will not being maintenance and show modal
        })
        .map(({ method }) => method);
      return [injected, ...availableWallets];
    },
    $_web3Onboard_initWalletOnboard () {
      this.walletConnectConfig = getConfig(this.$config)
      const supportedChains = [
        {
          id: this.networkConfigs.BSC.chainId,
          token: this.networkConfigs.BSC.nativeCurrency.symbol,
          label: this.networkConfigs.BSC.chainName,
          rpcUrl: this.networkConfigs.BSC.rpc[0]
        },
        {
          id: this.networkConfigs.Polygon.chainId,
          token: this.networkConfigs.Polygon.nativeCurrency.symbol,
          label: this.networkConfigs.Polygon.chainName,
          rpcUrl: this.networkConfigs.Polygon.rpc[0]
        },
        {
          id: this.networkConfigs.KDONG.chainId,
          token: this.networkConfigs.KDONG.nativeCurrency.symbol,
          label: this.networkConfigs.KDONG.chainName,
          rpcUrl: this.networkConfigs.KDONG.rpc[0]
        }
      ]
      const onboard = Onboard({
        wallets: this._dynamicImportWalletWithMaintenance(),
        chains: supportedChains,
        appMetadata: {
          name: 'ANOTRADE',
          icon: '/assets/images/common/icon-wallet-connect.svg', // TODO: change to logo
          description: 'ANOTRADE p2p',
          recommendedInjectedWallets: [
            {
              name: 'Metamask',
              url: 'https://metamask.io/download/'
            }
          ]
        },
        i18n: {
          en: {
            connect: {
              selectingWallet: {
                header: this.$t('web3.connect.selecting_wallet.header'),
                whyDontISeeMyWallet: this.$t('web3.connect.selecting_wallet.why_dont_i_see_my_wallet'),
                learnMore: ''
              },
              connectedWallet: {
                header: this.$t('web3.connect.selected_wallet.header'),
                mainText: this.$t('web3.connect.selected_wallet.main_text')
              },
              connectingWallet: {
                header: this.$t('web3.connect.connecting-wallet.header'),
                mainText: this.$t('web3.connect.connecting-wallet.main-text'),
                paragraph: this.$t('web3.connect.connecting-wallet.paragraph'),
                rejectedText: this.$t('web3.connect.connecting-wallet.rejected-text'),
                rejectedCTA: this.$t('web3.connect.connecting-wallet.rejected-cta'),
                primaryButton: this.$t('web3.connect.connecting-wallet.primary-button')
              }
            },
            modals: {
              actionRequired: {
                heading: this.$t('web3.modals.action_required.heading'),
                paragraph: this.$t('web3.modals.action_required.paragraph'),
                linkText: this.$t('web3.modals.action_required.link_text'),
                buttonText: this.$t('web3.modals.action_required.button_text')
              }
            }
          }
        },
        connect: {
          showSidebar: false,
          removeWhereIsMyWalletWarning: !this.isVisibleWarningTrustWallet
        },
        accountCenter: {
          mobile: {
            enabled: false
          },
          desktop: {
            enabled: false
          }
        }
      })
      this.setWeb3Onboard(onboard)
    },
    async $_web3Onboard_connectWallet (option = null) {
      if (!this.web3Onboard) {
        await this.$_web3Onboard_initWalletOnboard()
      }
      if (this.isVisibleWarningTrustWallet) {
        const onboardRootShadow = document.getElementsByTagName('onboard-v2')[0].shadowRoot
        const style = document.createElement('style');
        style.innerHTML = `
            :host .notice-container .container {
                display: flex;
                align-items: center;
                gap: 8px;
                flex-direction: row-reverse;
                color: var(--mode-light-dark-1000);
                font-size: 14px;
                line-height: 21px;
                border: 1px solid var(--branding-primary-600);
                background-color: var(--mode-light-dark-badget-pastel-green);
            }
            :host .notice-container .icon {
                width: 20px;
                height: 20px;
                color: #97E4E4;
            }
            @media(max-width: 767px) {
                :host .wallets-container {
                    display: flex;
                    flex-wrap: wrap;
                    border-bottom: none !important;
                }
                :host .wallet-button-container {
                    flex: 0 0 calc(25% - 6px);
                }
                :host .wallet-button-container-inner {
                    padding: 0 !important;
                }
                :host [class^='container svelte-'] {
                    padding-bottom: 100px !important;
                }
            }
            `;
        onboardRootShadow.appendChild(style);
        this.firstInitWallet = false
      }
      return await this.web3Onboard.connectWallet(option)
    },
    async $_web3Onboard_disconnectWallet (option = null) {
      if (!this.web3Onboard) {
        await this.$_web3Onboard_initWalletOnboard()
      }
      const [primaryWallet] = this.web3Onboard.state.get().wallets
      await this.web3Onboard.disconnectWallet({ label: primaryWallet?.label || 'ANOTRADE' })
    }
  }
}
