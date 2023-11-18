<script setup lang="ts">
import { Food, Recipe } from "~/lib/types";
import { foodStore } from "@/stores/food";
const config = useRuntimeConfig();
const userStore = useUserStore();
const { getUnitType } = unitTypesStore();
const route = useRoute();

const { getFoodTypes, getFoodType, set } = foodTypesStore();
const { getProcess, set: setProcess } = processStore();

if (getFoodTypes.length == 0) set();
if (getProcess.length <= 6) setProcess();

const { getFood } = foodStore();

let food: Ref<null | Food> = ref(null);
let recipes: Ref<Array<Recipe>> = ref([]);

const getRecipe = async (id: string) => {
  const data = await fetch(`${config.public.backEnd}recipe/${id}`, {
    headers: { Authorization: `Bearer ${userStore.getUser.token}` },
  }).then((data) => data.json());
  recipes.value = data;
  console.log(data[0]);
};

const ingredientId = ref(""),
  processId = ref(""),
  processIdType = ref(""),
  addAmount = ref(0);

const newRecipe = async () => {
  if (
    ingredientId.value !== "" &&
    processId.value !== "" &&
    addAmount.value > 0 &&
    food.value?._id
  ) {
    const data = await fetch(`${config.public.backEnd}recipe`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userStore.getUser.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        food: food.value._id,
        amount: addAmount.value,
        ingredient: ingredientId.value,
        process: processId.value,
      }),
    })
      .then((data) => data.json())
      .then((data) => data as Recipe);
    recipes.value.unshift(data);
  }


};

const delRecipe = async (id:string) =>await fetch(`${config.public.backEnd}recipe/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userStore.getUser.token}`,
      }
    })
      .then((_) =>{
        const index = recipes.value.findIndex(({_id})=>id===_id)
      if (index !== -1) {
      recipes.value.splice(index, 1);
      }
    });

onMounted(() => {
  food.value = typeof getFood === "string" ? JSON.parse(getFood) : getFood;
  if (route.params.id) getRecipe(route.params.id as string);
});
</script>

<template>
  <article v-if="food !== null" class="w-full max-w-5xl">
    <header class="relative w-full">
      <img
        class="min-w-full h-64 object-cover rounded-sm"
        :id="`img-${food._id}`"
        :src="food.img"
        :alt="food.name"
      />
      <div
        class="absolute text-right bottom-2 right-2 rounded-sm text-primary bg-primary-foreground py-1 px-2"
      >
        <h1 class="text-3xl">{{ food.name }}</h1>
        <h2 class="text-xl">${{ food.price }}</h2>
      </div>
    </header>
    <main>
      <br />
      <p class="max-w-3xl text-xl mx-auto border-b-2">
        {{ getFoodType(food.type) === null ? "" : getFoodType(food.type).name }}
      </p>
      <br />
      <p class="max-w-3xl mx-auto">{{ food.desc }}</p>
      <br />
      <UiTable class="w-full max-w-3xl mx-auto">
        <UiTableCaption>Receta</UiTableCaption>
        <UiTableHeader>
          <UiTableRow>
            <UiTableHead> Ingrediente </UiTableHead>
            <UiTableHead>Cantidad</UiTableHead>
            <UiTableHead>Proceso</UiTableHead>
            <UiTableHead class="text-right"> Actividad </UiTableHead>
          </UiTableRow>
        </UiTableHeader>
        <UiTableBody>
          <UiTableRow key="item._id">
            <UiTableCell class="font-medium">
              <AtomSearchIngredientRecipe
                v-model="ingredientId"
              ></AtomSearchIngredientRecipe>
            </UiTableCell>
            <UiTableCell class="flex items-center">
              <UiInput type="number" :class="processIdType==''?'':'w-3/4'" v-model="addAmount"></UiInput> 
              <p v-if="processIdType!==''" class="w-1/4 text-center">hola</p> 
            </UiTableCell>
            <UiTableCell>
              <UiSelect v-model="processId">
                <UiSelectTrigger class="">
                  <UiSelectValue placeholder="Procesos" />
                </UiSelectTrigger>
                <UiSelectContent>
                  <UiSelectGroup>
                    <UiSelectItem
                      v-for="option in getProcess"
                      :key="option._id"
                      :value="option._id"
                    >
                      {{ option.name }}
                    </UiSelectItem>
                  </UiSelectGroup>
                </UiSelectContent>
              </UiSelect>
            </UiTableCell>
            <UiTableCell class="text-right">
              <UiButton class="px-3" variant="outline" @click="newRecipe">
              ➕
              </UiButton>
            </UiTableCell>
          </UiTableRow>

          <UiTableRow v-for="item in recipes" key="item._id">
            <UiTableCell>
              {{ `${item.ingredient.name}` }}
            </UiTableCell>
            <UiTableCell
              >{{ item.amount }}
              {{ getUnitType(item.ingredient.unit)?.name }}
            </UiTableCell
            >
            <UiTableCell>
              {{ item.process.name }}
            </UiTableCell>
            <UiTableCell class="text-right">
              <UiButton class="px-3" variant="outline" @click="delRecipe(item._id)">
              ➖
              </UiButton>
            </UiTableCell>
          </UiTableRow>
        </UiTableBody>
      </UiTable>
      <br />
    </main>
  </article>
</template>
