import { USER_ROLE } from '@/config/constant.js';
export default function ({ store, redirect }) {
  const user = store.state.user.user || null
  if (user && user.type === USER_ROLE.USER) {
    redirect('/')
  }
}
