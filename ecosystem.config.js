module.exports = {
  apps: [
    {
      name: 'ANOTRADE',
      port: 3021,
      exec_mode: 'fork',
      instances: 1,
      script: './node_modules/nuxt/bin/nuxt.js',
      args: 'start -c ./nuxt.config.js',
      cwd: './',
      log_date_format: 'YYYY-MM-DD HH:mm Z'
    }
  ]

};
