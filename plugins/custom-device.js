export default function ({ req, $device }, inject) {
  const userAgent = getUserAgent(req);
  $device.isChromeIos = isChromeIos($device, userAgent);

  inject('refreshDevices', refreshDevices($device));
}

function getUserAgent (req) {
  return process.server ? req.headers?.['user-agent'] : navigator.userAgent;
}

function isChromeIos ($device, userAgent) {
  return $device.isIos && userAgent?.includes('CriOS');
}

function refreshDevices ($device) {
  return () => {
    if (!process.server) {
      $device.isDesktop = window.innerWidth >= 1024;
      $device.isMobile = window.innerWidth < 1024;
    }
    return $device;
  };
}
