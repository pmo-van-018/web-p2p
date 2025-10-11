export default {
  path: '/',
  // eslint-disable-next-line require-await
  async handler (req, res, next) {
    const countryCode = req.headers['cf-ipcountry'];
    if (req.url !== '/whitelist' &&
            process.env.CHECK_IP === '1' &&
            process.env.COUNTRY_CODE &&
            process.env.COUNTRY_CODE.includes(countryCode)) {
      const cookie = req.headers.cookie;
      if (cookie && !cookie.includes('email-whitelist')) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Access Denied');
        return;
      }
    }

    next();
  }
};
