<script setup lang="ts">
import { Food, Recipe } from "~/lib/types";     
import { foodStore } from "@/stores/food";
const config = useRuntimeConfig();
const userStore = useUserStore();
const route = useRoute();

const { getFoodTypes, getFoodType, set } = foodTypesStore();
if (getFoodTypes.length == 0) set();

const types = computed(() => getFoodTypes);

const { getFood } = foodStore()

let food: Ref<null | Food> =  ref(null)

const getRecipe = async (id:string)=>{
  const data = await fetch(
    `${config.public.backEnd}recipe/${id}`,
    {
      headers: { Authorization: `Bearer ${userStore.getUser.token}` },
    }
  ).then((data) => data.json());
  console.log(data)
}

onMounted(()=> {
  console.log('getFood: = = = ',route.params.id)
  console.log('getFood: = = = ',getFood?.name)
  food.value = getFood
  if(route.params.id)getRecipe(route.params.id)
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
  </main>
</article>
</template>
