import { useLocalStorage, useFetch } from "@vueuse/core";
import { FoodType } from "@/lib/types";

export const foodTypesStore = defineStore("foodTypes", {
  state: () => ({
    foodTypes: useLocalStorage("foodTypes", [] as Array<FoodType>),
  }),
  getters: {
    getFoodTypes: (state) => state.foodTypes as Array<FoodType>,
    getFoodType: (state) => (id: string) =>
      state.foodTypes.find((type) => id === type._id),
  },
  actions: {
    async set() {
      const { data, error } = await useFetch(
        `https://chefcito-back-production.up.railway.app/type/food`,
        { method: "get" }
      );
      if (error.value !== null) return console.log(error);

      const types = JSON.parse(data.value);

      this.foodTypes = types;
    },
    del() {
      this.foodTypes = [];
    },
  },

  hydrate(state, initialState) {
    state.foodTypes = useLocalStorage("foodTypes", []);
  },
});
