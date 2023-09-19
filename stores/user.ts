import { useLocalStorage, useFetch } from "@vueuse/core";
import { userRoutes } from "@/composables/useMyRoutes";
interface IUser {
  token: string;
  active: true;
  createdAt: string;
  lastName: string;
  mail: string;
  name: string;
  password: string;
  updatedAt: string;
  userType: {
    createdAt: string;
    desc: string;
    name: userRoutes;
    updatedAt: string;
  };
  verified: boolean;
}
export const useUserStore = defineStore("user", {
  state: () => ({
    user: useLocalStorage("user", {}),
  }),
  getters: {
    getUser: (state) => state.user as IUser,
  },
  actions: {
    async set(user: { user: { userType: any }; token: object } | null) {
      if (user === null) return;

      const { data, error } = await useFetch(
        `https://chefcito-back-production.up.railway.app/type/user`,
        { method: "get" }
      );
      if (error.value !== null) return console.log(error);

      const types = JSON.parse(data.value) as Array<{
        _id: string;
        name: string;
        desc: string;
        createdAt: string;
        updatedAt: string;
      }>;
      const type = types.filter((obj) => obj._id === user.user?.userType)[0];

      if (types) user.user.userType = type;

      this.user = { ...user.user, token: user.token };
    },
    del() {
      this.user = {};
    },
  },

  hydrate(state, initialState) {
    state.user = useLocalStorage("user", {});
  },
});
