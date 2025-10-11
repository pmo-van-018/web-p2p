export default {
  data () {
    return {
      isDarkMode: false
    };
  },
  mounted () {
    this.updateMode();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', this.updateMode);
  },
  beforeUnmount () {
    window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', this.updateMode);
  },
  methods: {
    updateMode () {
      this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  }
}
