import axios from 'axios'

const cacheTime = 1000 * 60 * 60 * 24; // a day
const axiosInstance = axios.create({
  baseURL: process.env.API_URL,
  timeout: 15000,
  headers: {
    'X-API-KEY': process.env.X_API_KEY
  }
})

const sitemap = {
  sitemaps: [
    {
      path: '/sitemap-general.xml',
      cacheTime,
      defaults: {
        lastmod: new Date()
      },
      routes: [
        '/', '/about', '/faq', '/privacy-principles', '/terms', '/marketplace'
      ],
      exclude: ['/**']
    },
    {
      path: '/sitemap-merchant.xml',
      cacheTime,
      defaults: {
        lastmod: new Date()
      },
      routes: async () => {
        const { data: response } = await axiosInstance.get('api/operation/ref-id')
        return response.data.items.map(item => `/merchant?ref=${item}`)
      },
      exclude: ['/**']
    }
  ],
  cacheTime
}

export default sitemap;
