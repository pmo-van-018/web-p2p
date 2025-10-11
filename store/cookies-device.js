import { USER_ROLE } from '@/config/constant'

export const COOKIES_DEVICE = {
  nuxtServerInit ({ commit, dispatch }, { app, route, req, redirect }) {
    initDevice({ commit }, { app, route, req, redirect })

    initAff({ commit }, { app, route, req, redirect })

    // get cookies login
    const userCookie = app.$cookies.get('user', { parseJSON: true });
    if (userCookie) {
      if (typeof userCookie !== 'string' || userCookie.substr(0, 2) !== 'j:') {
        return;
      }
      try {
        const user = JSON.parse(userCookie.slice(2));
        commit('user/SET_USER', user)
        if (user.type === USER_ROLE.MERCHANT_OPERATOR) {
          const routes = ['/merchant', '/notification']
          if (routes.some(item => app.context.route.path.includes(item))) {
            return
          }
          return redirect('/merchant/dashboard');
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      }
    } else {
      app.$cookies.remove('connect.sid');
      app.$cookies.remove('user');
      commit('user/SET_USER', null)
      commit('modal-message/INIT_MODAL', {
        type: 'manual',
        messages: [],
        api: '',
        isShow: false
      })
    }
    // const DOMAIN = req.headers.host;

    app.$cookies.set('domain', req.headers.host);
  }
}

const initDevice = ({ commit }, { app, route }) => {
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

const initAff = ({ commit }, { app, route, req }) => {
  if (route.query.a) {
    const affId = route.query.a
    app.$cookies.set('aff_id', affId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 10
    })
    const querystring = route.fullPath.substr('1')
    app.$cookies.set('querystring', querystring, {
      path: '/',
      maxAge: 60 * 60 * 24 * 10
    })
  }

  if (route.query.v) {
    const affId = route.query.v
    app.$cookies.set('sale_id', affId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 10
    })
  }
  const arrQuery = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']

  arrQuery.forEach((e) => {
    if (route.query[e]) {
      const value = route.query[e]
      app.$cookies.set(e, value, {
        path: '/',
        maxAge: 60 * 60 * 24 * 10
      })
    }
  })
}
