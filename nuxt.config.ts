// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
  ],
  colorMode: {
    preference: 'light',
    fallback: 'light'
  },
  css: [
    '@/assets/style/main.scss',
  ],
  imports: {
    dirs: ['./stores'],
  },
  pinia: {
    autoImports: ['defineStore', 'acceptHMRUpdate'],
  },
  runtimeConfig:{
    public:{
      backEnd:'https://chefcito-back-production.up.railway.app/'
    }
  },
  app:{
    head:{
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }
      ]
    }
  },
})
