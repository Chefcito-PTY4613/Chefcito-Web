import { Food } from "@/lib/types";
import { useLocalStorage } from "@vueuse/core";

export const foodStore = defineStore("food", {
  state: () => ({
    food: useLocalStorage("food", '' as String),
  }),
  getters: {
    getFood: (state) =>  state.food as String,
  },
  actions: {
    setFood(data:Food) {
      this.food = JSON.stringify(data);
    },
    del() {
      this.food = '';
    },
  },

  hydrate(state, initialState) {
    state.food = useLocalStorage("food", '');
  },
});
