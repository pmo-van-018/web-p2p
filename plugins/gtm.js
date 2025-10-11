
export default ({ app: { head }, $config }) => {
  const gtmKey = $config.GOOGLE_TAG_MANAGER_ID
  const dnt = "(function(w,n,d,m,e,p){w[d]=(w[d]==1||n[d]=='yes'||n[d]==1||n[m]==1||(w[e]&&w[e][p]&&w[e][p]()))?1:0})(window,navigator,'doNotTrack','msDoNotTrack','external','msTrackingProtectionEnabled')"
  if (!gtmKey) { // In case I have other pages not in the switch statement above
    return;
  }
  const options = {
    enabled: undefined,
    debug: false,

    id: gtmKey,
    layer: 'dataLayer',
    variables: {},

    pageTracking: false,
    pageViewEventName: 'nuxtRoute',

    autoInit: true,
    respectDoNotTrack: true,

    scriptId: 'gtm-script',
    scriptDefer: false,
    scriptURL: 'https://www.googletagmanager.com/gtm.js',
    crossOrigin: false,

    noscript: true,
    noscriptId: 'gtm-noscript',
    noscriptURL: 'https://www.googletagmanager.com/ns.html'
  }

  // Build query
  const query = {
    // Default is dataLayer for google
    l: options.layer !== 'dataLayer' ? options.layer : null,
    ...options.variables
  }
  const queryString = Object.keys(query)
    .filter(key => query[key] !== null && query[key] !== undefined)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
    .join('&')

  // Compile scripts
  const injectScript = `var f=d.getElementsByTagName(s)[0],j=d.createElement(s);${options.crossOrigin ? 'j.crossOrigin=\'' + options.crossOrigin + '\';' : ''}j.rel='dns-prefetch';j.as='script';j.href='${options.scriptURL + '?id=\'+i' + (queryString ? (`+'&${queryString}` + '\'') : '')};f.parentNode.insertBefore(j,f)` // deps: d,s,i

  const doNotTrackScript = options.respectDoNotTrack ? 'if(w.doNotTrack||w[x][i])return;' : ''

  const initLayer = "w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'})" // deps: w,l
  let script = `w[x]={};w._gtm_inject=function(i){${doNotTrackScript}w[x][i]=1;${initLayer};${injectScript};}`

  if (options.autoInit && options.id) {
    script += `;w[y]('${options.id}')`
  }

  // Add doNotTrack polyfill and wrap to IIFE
  script = `${dnt};(function(w,d,s,l,x,y){${script}})(window,document,'link','${options.layer}','_gtm_ids','_gtm_inject')`

  head.script.push({
    hid: options.scriptId,
    innerHTML: script
  })

  // Prepend google tag manager <noscript> fallback to <body>
  const surfixUrl = queryString ? `&${queryString}` : ''
  const renderIframe = id => `<iframe src="${options.noscriptURL + '?id=' + id + surfixUrl}" height="0" width="0" style="display:none;visibility:hidden" title="gtm"></iframe>`
  if (options.noscript) {
    head.noscript = head.noscript || []
    head.noscript.push({
      hid: options.noscriptId,
      pbody: true,
      innerHTML: options.id ? renderIframe(options.id) : '' /* placeholder for SSR calls */
    })
  }
  // Disable sanitazions
  head.__dangerouslyDisableSanitizersByTagID = head.__dangerouslyDisableSanitizersByTagID || {}
  head.__dangerouslyDisableSanitizersByTagID[options.scriptId] = ['innerHTML']
  head.__dangerouslyDisableSanitizersByTagID[options.noscriptId] = ['innerHTML']
}
