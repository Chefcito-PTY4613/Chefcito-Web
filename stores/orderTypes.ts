import { useLocalStorage, useFetch } from "@vueuse/core";
import { Status } from "@/lib/types";

export const orderTypesStore = defineStore("orderTypes", {
  state: () => ({
    orderTypes: useLocalStorage("orderTypes", [] as Array<Status>),
  }),
  getters: {
    getOrderTypes: (state) => state.orderTypes as Array<Status>,
    getOrderType: (state) => (id: string) =>
      state.orderTypes.find((type) => id === type._id),
    getOrderTypeName: (state) => (name: string) =>
      state.orderTypes.find((type) => name === type.name),
  },
  actions: {
    async init() {
      if (this.orderTypes.length === 0) {
        await this.set();
      }
    },
    async set() {
      const { data, error } = await useFetch(
        `https://chefcito-back-production.up.railway.app/type/order`,
        { method: "get" }
      );
      if (error.value !== null) return console.log(error);

      const types = JSON.parse(data.value);

      this.orderTypes = types;
    },
    del() {
      this.orderTypes = [];
    },
  },

  hydrate(state, initialState) {
    state.orderTypes = useLocalStorage("orderTypes", []);
  },
});
