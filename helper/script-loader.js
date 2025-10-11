export default function loadScript (src, async = true) {
  return new Promise((resolve, reject) => {
    const scriptSelector = document.querySelector(`script[src="${src}"]`)
    if (scriptSelector) {
      resolve({ loaded: true, status: 'Already Loaded' });
    } else {
      // load script
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = src;
      script.async = async;
      if (script.readyState) {
        script.onreadystatechange = () => {
          if (script.readyState === 'loaded' || script.readyState === 'complete') {
            script.onreadystatechange = null;
            resolve({ loaded: true, status: 'Loaded' });
          }
        };
      } else {
        script.onload = () => {
          resolve({ loaded: true, status: 'Loaded' });
        };
      }
      script.onerror = () => resolve({ loaded: false, status: 'Loaded' });
      document.getElementsByTagName('head')[0]?.appendChild(script);
    }
  });
}
