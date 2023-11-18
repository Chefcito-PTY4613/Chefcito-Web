import { useLocalStorage, useFetch } from "@vueuse/core";
import { Process } from "@/lib/types";

export const processStore = defineStore("process", {
  state: () => ({
    process: useLocalStorage("process", [] as Array<Process>),
  }),
  getters: {
    getProcess: (state) => state.process as Array<Process>,
    getProcessById: (state) => (id: string) =>
      state.process.find((type) => id === type._id),
  },
  actions: {
    async set() {
      const { data, error } = await useFetch(
        `https://chefcito-back-production.up.railway.app/type/proccess`,
        { method: "get" }
      );
      if (error.value !== null) return console.log(error);

      const types = JSON.parse(data.value as string);

      this.process = types as Array<Process>;
    },
    del() {
      this.process = [];
    },
  },

  hydrate(state, initialState) {
    state.process = useLocalStorage("process", []);
  },
});

