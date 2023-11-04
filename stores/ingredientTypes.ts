import { useLocalStorage, useFetch } from "@vueuse/core";
import { Ingredient } from "@/lib/types";

export const ingredientTypesStore = defineStore("ingredientTypes", {
  state: () => ({
    ingredientTypes: useLocalStorage("ingredientTypes", [] as Array<Ingredient>),
  }),
  getters: {
    getIngredientTypes: (state) => state.ingredientTypes as Array<Ingredient>,
    getIngredientType: (state) => (id: string) =>
      state.ingredientTypes.find((type) => id === type._id),
  },
  actions: {
    async set() {
      const { data, error } = await useFetch(
        `https://chefcito-back-production.up.railway.app/type/ingredient`,
        { method: "get" }
      );
      if (error.value !== null) return console.log(error);

      const types = JSON.parse(data.value);

      this.ingredientTypes = types;
    },
    del() {
      this.ingredientTypes = [];
    },
  },

  hydrate(state, initialState) {
    state.ingredientTypes = useLocalStorage("ingredientTypes", []);
  },
});
