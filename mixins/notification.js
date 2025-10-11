/* eslint-disable arrow-spacing */
import { mapActions, mapState } from 'vuex'
import NOTIFICATION_API from '@/api/notification'
import { NAME_EVENT_WS_LISTEN_NOTIFICATION, NAME_EVENT_WS_LISTEN, USER_TYPE } from '@/config/constant'
import { NOTIFICATION_TYPE } from '@/constants/notification';
import USER_API from '@/api/user'
import { OPERATION_API } from '@/api/operation';
import { ADMIN_API } from '@/api/admin';
import loadScript from '@/helper/script-loader'
import { ONE_SIGNAL_CDN } from '@/constants/external-link'
import { getRoleTypeByPrefix, mergeByProp } from '~/helper';

export default {
  computed: {
    ...mapState('user', ['user']),
    ...mapState(['notification'])
  },
  async mounted () {
    // Listen to create new Subscription
    if (this.user) {
      this.$socket.client.emit(NAME_EVENT_WS_LISTEN_NOTIFICATION);
      this.$socket.client.on(NAME_EVENT_WS_LISTEN, this.onListenEventNotification);
      await this.$_notificationMixin_createSubscription(this.user?.walletAddress);
    }
  },
  methods: {
    ...mapActions('notification', ['setNotification', 'setTotalBell', 'setTotalSystem', 'setTotalTransaction', 'setTotalNotification']),
    async $_notificationMixin_createSubscription (walletAddress) {
      // Check Onesignal enable subscribe notifications
      // TODO: Will re-open when continue implementing Notification feature
      // eslint-disable-next-line no-console
      await loadScript(ONE_SIGNAL_CDN)
      const {
        ONESIGNAL_ENABLE,
        ONESIGNAL_APP_ID_USER,
        ONESIGNAL_APP_ID_OPERATION,
        ONESIGNAL_APP_ID_ADMIN,
        OPERATION_PREFIX,
        ADMIN_PREFIX
      } = this.$config
      const oneSignalEnable = Number(ONESIGNAL_ENABLE);
      if (!oneSignalEnable) {
        return;
      }
      const currentHost = window.location.hostname;
      let oneSignalAppId = ONESIGNAL_APP_ID_USER
      if (currentHost.includes(OPERATION_PREFIX)) {
        oneSignalAppId = ONESIGNAL_APP_ID_OPERATION
      } else if (currentHost.includes(ADMIN_PREFIX)) {
        oneSignalAppId = ONESIGNAL_APP_ID_ADMIN
      }
      const OneSignal = window.OneSignal || [];
      const initConfig = {
        appId: oneSignalAppId,
        notifyButton: {
          enable: true
        }
      };
      OneSignal.push(() => {
        OneSignal.SERVICE_WORKER_PARAM = { scope: '/' };
        OneSignal.SERVICE_WORKER_PATH = '/OneSignalSDKWorker.js'
        OneSignal.SERVICE_WORKER_UPDATER_PATH = '/OneSignalSDKWorker.js'
        OneSignal.init(initConfig);
        OneSignal.on('subscriptionChange', (isSubscribed) => {
          if (isSubscribed) {
            OneSignal.push(()=>{
              OneSignal.getUserId((userId) => {
                OneSignal.push(()=>{
                  OneSignal.setExternalUserId(walletAddress)
                })
                this.createSubscribe(userId)
              })
            }
            )
          }
        });
        OneSignal.isPushNotificationsEnabled().then((isEnabled) => {
          // eslint-disable-next-line no-console
          console.log('Push notifications enabled: ' + isEnabled)
          if (isEnabled) {
            OneSignal.push(()=>{
              OneSignal.getUserId((userId)=>{
                this.createSubscribe(userId)
              })
            })
          }
        });
        OneSignal.setExternalUserId(walletAddress)
      });
    },
    onListenEventNotification (data) {
      const notificationFormatter = JSON.parse(data);
      if (notificationFormatter && notificationFormatter.event === NAME_EVENT_WS_LISTEN_NOTIFICATION) {
        this.setTotalBell(notificationFormatter.total || 0);
        const notifications = mergeByProp(
          [{ ...notificationFormatter, unread: true }],
          this.notification?.items, 'id')
        this.setNotification(notifications.slice(0, 10))
        this.setTotalNotification(this.notification?.totalItem + 1)
        if (notificationFormatter?.type === NOTIFICATION_TYPE.SYSTEM) {
          this.setTotalSystem(this.notification?.totalSystem + 1)
        } else {
          this.setTotalTransaction(this.notification?.totalTransaction + 1)
        }
      }
    },
    async createSubscribe (playerId) {
      try {
        const result = await this.$axios.$post(NOTIFICATION_API.CREATE_SUBSCRIPTION, {
          playerId
        });
        return result;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e)
      }
    },
    async updateNotificationSetting () {
      let updateInfoUrl;
      if (getRoleTypeByPrefix(this.$config.ADMIN_PREFIX) === USER_TYPE.ADMIN) {
        updateInfoUrl = ADMIN_API.UPDATE
      } else if (getRoleTypeByPrefix(this.$config.OPERATION_DOMAIN) === USER_TYPE.MERCHANT) {
        updateInfoUrl = OPERATION_API.UPDATE_INFO
      } else {
        updateInfoUrl = USER_API.UPDATE_ALLOW_NOTIFICATION
      }

      try {
        const result = await this.$axios.$put(updateInfoUrl, {
          allowNotification: [NOTIFICATION_TYPE.ALL]
        })
        return result;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e)
      }
    }
  }
}
