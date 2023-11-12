import { Food } from "@/lib/types";
import { useLocalStorage } from "@vueuse/core";

export const foodStore = defineStore("food", {
  state: () => ({
    food: useLocalStorage("food", null as Food|null),
  }),
  getters: {
    getFood: (state) =>  state.food as Food|null,
  },
  actions: {
    setFood(data:Food) {
      this.food = data;
    },
    del() {
      this.food = null;
    },
  },

  hydrate(state, initialState) {
    state.food = useLocalStorage("food", {});
  },
});
