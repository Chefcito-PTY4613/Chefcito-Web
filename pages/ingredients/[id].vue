<script setup lang="ts">
import { Food, Recipe } from "~/lib/types";     
import { foodStore } from "@/stores/food";
const config = useRuntimeConfig();
const userStore = useUserStore();
const { getUnitType } = unitTypesStore();
const route = useRoute();

const { getFoodTypes, getFoodType, set } = foodTypesStore();
if (getFoodTypes.length == 0) set();

const types = computed(() => getFoodTypes);

const { getFood } = foodStore()

let food: Ref<null | Food> =  ref(null)
let recipes: Ref<Array<Recipe>> =  ref([])

const getRecipe = async (id:string)=>{
  const data = await fetch(
    `${config.public.backEnd}recipe/${id}`,
    {
      headers: { Authorization: `Bearer ${userStore.getUser.token}` },
    }
  ).then((data) => data.json());
  recipes.value = data
  console.log(data[0])
}

onMounted(()=> {
  food.value = (typeof getFood === 'string' ) ? JSON.parse(getFood):getFood
  if(route.params.id)getRecipe(route.params.id as string)
  })
</script>

<template>
<article v-if = "food !== null" class="w-full max-w-5xl">
  <header class="relative w-full">
    <img class="min-w-full h-64 object-cover rounded-sm" :id="`img-${food._id}`" :src="food.img" :alt="food.name">
    <div class="absolute text-right bottom-2 right-2 rounded-sm text-primary bg-primary-foreground py-1 px-2">
      <h1 class="text-3xl">{{ food.name }}</h1>
      <h2 class="text-xl">${{ food.price }}</h2>
    </div>
  </header>
  <main>
    <br>
    <p class="max-w-3xl text-xl mx-auto border-b-2">{{ getFoodType(food.type).name }}</p>
    <br>
    <p class="max-w-3xl mx-auto">{{ food.desc }}</p>
   <br>
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
        <AtomSearchIngredientRecipe></AtomSearchIngredientRecipe>
        
        <UiTableRow key="item._id">
          <UiTableCell class="font-medium">
          </UiTableCell>
          <UiTableCell>
            </UiTableCell>
          <UiTableCell>
          
          </UiTableCell>
          <UiTableCell class="text-right">
     
          </UiTableCell> 
        </UiTableRow>
        <UiTableRow v-for="item in recipes" key="item._id">
          <UiTableCell class="font-medium">
            {{ `${item.ingredient.name}` }}
          </UiTableCell>
          <UiTableCell>{{item.amount}} {{ getUnitType(item.ingredient.unit)?.name }}</UiTableCell>
          <UiTableCell>
            {{ item.process.name }}
          </UiTableCell>
          <UiTableCell class="text-right">
            a
          </UiTableCell> 
        </UiTableRow>
      </UiTableBody>
    </UiTable>
    <br>
  </main>
</article>
</template>
