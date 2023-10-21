import QRCode from 'qrcode.vue';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('QRCode',QRCode)
});