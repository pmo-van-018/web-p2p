/* eslint-disable no-console */
import { USER_ROLE } from '@/config/constant'
import USER_API from '@/api/user';
import { OPERATION_API } from '@/api/operation';
import { ADMIN_API } from '@/api/admin';
import { getSessionKey } from '@/helper/session';
import REPORTER_API from '@/api/reporter';

export const state = () => ({
  device: 'desktop',
  staticDomain: '',
  isHideMenuBottom: false,
  isCollapseSidebarLeft: true
})

export const mutations = {
  mutate (state, payload) {
    state[payload.property] = typeof payload.with === 'object' && payload.with !== null ? { ...state[payload.property], ...payload.with } : payload.with
  }
}
const initDevice = ({ commit }, { app, route }) => {
  commit('mutate', {
    property: 'staticDomain',
    with: app.$config.STATIC_DOMAIN
  })
  // get device from cookies
  const device = app.$cookies.get('setDevice')
  if (device) {
    commit('mutate', {
      property: 'device',
      with: device
    })
  }
  if (route.query.device) {
    // set fake device cookies
    app.$cookies.set('setDevice', route.query.device, {
      path: '/',
      maxAge: 60 * 60 * 24 * 10
    })
    app.$cookies.set('device', route.query.device, {
      path: '/'
    })
    commit('mutate', {
      property: 'device',
      with: route.query.device
    })
    if (route.query.device === 'mobile') {
      app.$cookies.set('os', 'ios', {
        path: '/'
      })
    } else {
      app.$cookies.set('os', '', {
        path: '/'
      })
    }
  }
  // set device cookie by real device
  if (app.$device.isDesktop) {
    app.$cookies.set('device', 'desktop', {
      path: '/'
    })
    if (!device) {
      commit('mutate', {
        property: 'device',
        with: 'desktop'
      })
    }
    app.$cookies.set('os', 'desktop', { path: '/' })
  } else {
    app.$cookies.set('device', 'mobile', {
      path: '/'
    })
    if (app.$device.isIos) {
      app.$cookies.set('os', 'ios', {
        path: '/'
      })
    } else {
      app.$cookies.set('os', 'android', {
        path: '/'
      })
    }
    if (!device) {
      commit('mutate', {
        property: 'device',
        with: 'mobile'
      })
    }
  }
}

export const actions = {
  async nuxtServerInit ({ commit, dispatch }, { app, route, req, redirect }) {
    initDevice({ commit }, { app, route, req, redirect })
    const sessionKey = getSessionKey(req.headers.host)
    console.log('eq.headers.hosteq.headers.host', req.headers.host, sessionKey)
    const sessionId = app.$cookies.get(sessionKey)
    console.log('sessionIdsessionIdsessionId', sessionId)
    let user = null
    if (sessionId) {
      if (req.headers.host === app.$config.USER_DOMAIN) {
        user = await dispatch('getCurrentUserInfo', app.$axios);
      } else if (req.headers.host === app.$config.OPERATION_DOMAIN) {
        console.log('getCurrentUserInfogetCurrentUserInfo')
        user = await dispatch('getCurrentOperationInfo', app.$axios);
      } else if (req.headers.host === app.$config.ADMIN_DOMAIN) {
        user = await dispatch('getCurrentAdminInfo', app.$axios);
      } else if (req.headers.host === app.$config.REPORTER_DOMAIN) {
        user = await dispatch('getCurrentUserPasswordInfo', app.$axios);
      } else {
        app.$cookies.remove(sessionKey);
      }
    }
    console.log('useruseruseruseruser', user)
    if (user) {
      if (user.type === USER_ROLE.MERCHANT_SUPPORTER) {
        const routes = ['/supporter']
        if (routes.some(item => app.context.route.path.includes(item))) {
          return
        }
        return redirect('/supporter/orders');
      }
      if (user.type === USER_ROLE.MERCHANT_OPERATOR) {
        const routes = ['/merchant', '/notification', '/account', '/merchant/shift-management']
        if (routes.some(item => app.context.route.path.includes(item))) {
          return
        }
        return redirect('/merchant/shift-management');
      }
      if (user.type === USER_ROLE.MERCHANT_MANAGER) {
        const routes = ['/merchant-manager', '/account', '/profile', '/notification']
        if (routes.some(item => app.context.route.path.includes(item))) {
          return
        }
        return redirect('/merchant-manager/dashboard');
      }
      if (user.type === USER_ROLE.SUPER_ADMIN) {
        const routes = ['/admin', '/account', 'notification', '/appeal-detail', '/users', '/appeals', '/support-requests', '/merchant-managers', '/blacklists', '/news']
        if (routes.some(item => app.context.route.path.includes(item))) {
          return
        }
        return redirect('/dashboard');
      }
      if (user.type === USER_ROLE.SYSTEM_ADMIN) {
        const routes = ['/system-admin/system-settings', '/system-admin/ui-settings', '/system-admin/admins']
        if (routes.some(item => app.context.route.path.includes(item))) {
          return
        }
        return redirect('/system-admin/system-settings');
      }
      if (user.type === USER_ROLE.ADMIN_SUPPORTER) {
        const routes = ['/admin-supporter/appeal-detail', '/admin-supporter/list-appeals', '/admin-supporter/support-requests', 'admin-supporter/orders']
        if (routes.some(item => app.context.route.path.includes(item))) {
          return
        }
        return redirect('/admin-supporter/list-appeals');
      }
      if (user.type === USER_ROLE.USER) {
        const displayMode = route.query?.displayMode || null
        await dispatch('user-orders/getCurrentPendingOrder', { $axios: app.$axios, redirect, displayMode })
      }
    } else {
      app.$cookies.remove(sessionKey);
      commit('modal-message/INIT_MODAL', {
        type: 'manual',
        messages: [],
        api: '',
        isShow: false
      })
    }
    // const DOMAIN = req.headers.host;

    app.$cookies.set('domain', req.headers.host);
  },
  async getCurrentUserInfo ({ commit }, $axios) {
    try {
      const { data } = await $axios.get(USER_API.INFO)
      if (data?.data) {
        commit('user/SET_USER', { ...data.data, prefixAvatarLink: '/assets/images/common/user/avatar/' })
      }
      return data.data
    } catch (e) {
      console.error(e)
      return null
    }
  },
  async getCurrentOperationInfo ({ commit }, $axios) {
    try {
      const { data } = await $axios.get(OPERATION_API.INFO)
      if (data?.data) {
        commit('user/SET_USER', { ...data.data, prefixAvatarLink: '/assets/images/common/merchant-manager/avatar/' })
      }
      return data.data
    } catch (e) {
      console.error(e)
      return null
    }
  },
  async getCurrentAdminInfo ({ commit }, $axios) {
    try {
      const { data } = await $axios.get(ADMIN_API.INFO)
      if (data?.data) {
        commit('user/SET_USER', data.data)
      }
      return data.data
    } catch (e) {
      console.error(e)
      return null
    }
  },
  async getCurrentUserPasswordInfo ({ commit }, $axios) {
    try {
      const { data } = await $axios.get(REPORTER_API.GET_INFO)
      if (data?.data) {
        commit('reporter/SET_USER', data.data)
      }
      return data.data
    } catch (e) {
      console.error(e)
      return null
    }
  }
}
