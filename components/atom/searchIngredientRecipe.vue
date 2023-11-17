<script setup lang="ts">
import { ChevronsUpDown } from "lucide-vue-next";
interface resumeIngredient {
  _id: string;
  name: string;
  unit: string;
}

const config = useRuntimeConfig();
const userStore = useUserStore();
const ingredient: Ref<Array<resumeIngredient>> = ref([]);

const get = async (name: string = "") => {
  const data = await fetch(
    `${config.public.backEnd}ingredient/recipe?name=${name}`,
    {
      headers: { Authorization: `Bearer ${userStore.getUser.token}` },
    }
  )
    .then((data) => data.json())
    .then(({ data }) => data);
  return (data as Array<resumeIngredient>) || ([] as Array<resumeIngredient>);
};

const selectFn = (item: resumeIngredient) => {
  open.value = false;
  value.value = item;
};

const open = ref(false);
const value = ref<resumeIngredient>();

const filterFunction = async (
  search: string
) => {
  ingredient.value = await get(search.length > 1 ? search:'')
  console.log(ingredient.value)
};

onMounted(async() => (ingredient.value = await get()));
</script>

<template>
  <UiPopover v-model:open="open">
    <UiPopoverTrigger as-child>
      <UiButton
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        class="w-[200px] justify-between"
      >
        {{ value ? value.name : "Selecciona" }}
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </UiButton>
    </UiPopoverTrigger>
    <UiPopoverContent class="w-[200px] p-0">
      <UiCommand >
        <UiCommandInput @input="event =>  filterFunction(event.target.value as string)" placeholder="Busca igrediente" />
        <UiCommandEmpty>Ingrediente no encontrado.</UiCommandEmpty>
        <UiCommandGroup>
          <UiCommandItem
            v-for="item in ingredient"
            :key="item._id"
            :value="item"
            @click="selectFn(item)"
          >
            {{ item.name }}
          </UiCommandItem>
        </UiCommandGroup>
      </UiCommand>
    </UiPopoverContent>
  </UiPopover>
</template>
