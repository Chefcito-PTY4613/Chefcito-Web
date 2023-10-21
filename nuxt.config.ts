// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
  ],
  colorMode: {
    preference: 'light',
    fallback: 'light',
    classPrefix:'',
    classSuffix:''
  },
  css: [
    '@/assets/style/main.scss',
    '@/assets/css/tailwind.css',
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
      //backEnd:'http://localhost:4000/'
    }
  },
  app:{
    head:{
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }
      ]
    }
  },
  plugins:[
    {src:'./plugin/qrcode.ts', mode:'client'}
  ]
  // components: [
  //   {
  //     path: '~/components/ui',
  //     extensions: ['.vue'],
  //     prefix: 'Ui'
  //   },
  //   {
  //     path: '~/components/atom',
  //     extensions: ['.vue'],
  //     prefix: 'Atom'
  //   },
  //   {
  //     path: '~/components/molecules',
  //     extensions: ['.vue'],
  //     prefix: 'Molecules'
  //   },
  // ],
})
