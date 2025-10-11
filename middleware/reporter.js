export default function ({ store, redirect }) {
  if (store.state.reporter.user === null) {
    return redirect('/');
  }
}
