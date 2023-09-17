import { useLocalStorage  } from "@vueuse/core"
interface IUser {
  token?:string;
}
export const useUserStore = defineStore('user', {
    state: () => ({
        user: useLocalStorage('user',{})
      }),  
      getters: {
        getUser: (state) => state.user as IUser,
      },
      actions: {
        set(user:Object) {
            this.user = user
          },
        del() {
          this.user = {}
        },
      },
      hydrate(state,initialState){
        state.user = useLocalStorage('user',{})
      }
})