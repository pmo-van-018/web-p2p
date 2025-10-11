import { USER_ROLE } from '@/config/constant.js';

export default function ({ store, redirect, route }) {
  const user = store.state.user.user || null
  if (user && user.type === USER_ROLE.USER) {
    return redirect('/');
  }

  if (route.path === '/user' || route.path === '/user/') {
    return redirect('/user/orders?status=pending')
  }
}
