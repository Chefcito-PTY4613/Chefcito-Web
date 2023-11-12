import { useLocalStorage, useFetch } from "@vueuse/core";

export interface IUserType {
  _id?: string;
  name: string;
  desc: string;
}
export const useUserTypesStore = defineStore("userTypes", {
  state: () => ({
    userTypes: useLocalStorage("userTypes", [] as Array<IUserType>),
  }),
  getters: {
    getUserTypes: (state) => state.userTypes as Array<IUserType>,
    getUserType: (state) => (id: string) =>
      state.userTypes.find((type) => id === type._id),
  },
  actions: {
    async set() {
      const { data, error } = await useFetch(
        `https://chefcito-back-production.up.railway.app/type/user`,
        { method: "get" }
      );
      if (error.value !== null) return console.log(error);

      const types = JSON.parse(data.value as string);

      this.userTypes = types;
    },
    del() {
      this.userTypes = [];
    },
  },

  hydrate(state, initialState) {
    state.userTypes = useLocalStorage("userTypes", []);
  },
});
