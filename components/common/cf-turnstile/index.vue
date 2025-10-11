<template>
  <div id="cf-turnstile" class="cf-turnstile" :data-sitekey="dataSiteKey" :data-theme="dataTheme"></div>
</template>
<script>
export default {
  props: {
    verify: {
      type: Boolean,
      default: true
    },
    isRemove: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      dataSiteKey: this.$config.turnstile.siteKey,
      widgetId: '',
      dataTheme: 'auto'
    }
  },
  watch: {
    verify: {
      handler (value) {
        if (value) {
          this.render()
        }
      },
      immediate: true
    }
  },
  mounted () {
    this.dataTheme = window.location.host !== this.$config.USER_DOMAIN ? 'light' : 'auto';
  },
  beforeDestroy () {
    if (this.widgetId) {
      window.turnstile.remove(this.widgetId)
    }
  },
  methods: {
    render () {
      window.turnstile.ready(() => {
        setTimeout(() => {
          if (!this.widgetId) {
            this.widgetId = window.turnstile.render('#cf-turnstile', {
              retry: 'auto',
              'refresh-expired': 'manual',
              callback: (token) => {
                this.remove(token)
              },
              'error-callback': () => {
                this.remove(null)
              }
            });
          }
        }, 150)
      });
    },
    remove (token) {
      setTimeout(() => {
        this.$emit('challenge', token)
        if (this.isRemove) {
          window.turnstile.remove(this.widgetId)
        }
      }, 1000)
    }
  }
}
</script>
