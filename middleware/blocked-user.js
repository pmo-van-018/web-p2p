export default function ({ store, redirect }) {
  if (!store.state.user.lockedUserData) {
    return redirect('/');
  }
}
