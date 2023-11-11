
import {Socket,io} from 'socket.io-client'
export default function useSocket() {
  const config = useRuntimeConfig(); 
  const socket: Socket = io(config.public.backEnd);
  return {socket};
}
