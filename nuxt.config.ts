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
      htmlAttrs:{
        lang:"es"
      },
      meta:[
        {name:'theme-color',content:'#fdf3c4'},
        {name:'description',content:'Chefcito: Sistema de gestión integral para restaurantes, ofreciendo soluciones de administración en roles como administrador, cliente, bodega, finanzas y cocina. Con capacidades avanzadas para la gestión de recursos, control de stock, optimización financiera y operativa, Chefcito facilita la experiencia culinaria con pedidos en mesa y gestión eficiente de órdenes. Incluye módulos web y de escritorio, autenticación segura, reportes en PDF, diseño responsive y está construido sobre Nuxt.js, Sockets.io, Typescript y la mejor de las intenciones'}
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
        {
          rel: 'preload',
        href: '/font/Montserrat-Italic.woff2',
        as: 'font',
        type: 'font/woff2'
        },
        {
          rel: 'preload',
        href: '/font/Montserrat-Medium.woff2',
        as: 'font',
        type: 'font/woff2'
        },
        {
          rel: 'preload',
        href: '/font/Montserrat-SemiBold.woff2',
        as: 'font',
        type: 'font/woff2'
        }
      ]
    },
    pageTransition: {
      name: 'page',
      mode: 'out-in'
    }
  },
  plugins:[
    {src:'./plugin/qrcode.ts', mode:'client'},
  ],
  experimental:{
    viewTransition:true
  },
})
