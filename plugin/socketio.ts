import {Socket,io} from 'socket.io-client'

export default defineNuxtPlugin((nuxtApp)=>{
  const config = useRuntimeConfig(); 
  const socket: Socket = io(config.public.backEnd);
  nuxtApp.vueApp.config.globalProperties.$socket = socket;
  
})