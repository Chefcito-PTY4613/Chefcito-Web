import { useLocalStorage, useFetch } from "@vueuse/core";
import { Status } from "@/lib/types";

export const unitTypesStore = defineStore("unitTypes", {
  state: () => ({
    unitTypes: useLocalStorage("unitTypes", [] as Array<Status>),
  }),
  getters: {
    getUnitTypes: (state) => state.unitTypes as Array<Status>,
    getUnitType: (state) => (id: string) =>
      state.unitTypes.find((type) => id === type._id),
  },
  actions: {
    async set() {
      const { data, error } = await useFetch(
        `https://chefcito-back-production.up.railway.app/type/measurement`,
        { method: "get" }
      );
      if (error.value !== null) return console.log(error);

      const types = JSON.parse(data.value);

      this.unitTypes = types;
    },
    del() {
      this.unitTypes = [];
    },
  },

  hydrate(state, initialState) {
    state.unitTypes = useLocalStorage("unitTypes", []);
  },
});
