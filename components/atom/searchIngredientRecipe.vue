<template>
  <div class="combobox">
    <UiSelect v-model="selectedValue" @change="onChange">
      <UiSelectTrigger class="">
        <UiSelectValue placeholder="Ingredientes" />
      </UiSelectTrigger>
      <UiSelectContent>
        <UiSelectGroup>
          <UiInput
            type="text"
            v-model="searchTerm"
            @input="fetchOptions"
            placeholder="Buscar..."
          />
          <UiSelectItem
            v-for="option in options"
            :key="option._id"
            :value="option._id"
          >
            {{ option.name }} ({{getUnitType(option.unit).name}})
          </UiSelectItem>
        </UiSelectGroup>
      </UiSelectContent>
    </UiSelect>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  modelValue: String,
});
const { getUnitType, getUnitTypes, set } = unitTypesStore();
if (getUnitTypes.length == 0) set();
interface resumeIngredient {
  _id: string;
  name: string;
  unit: string;
}
const config = useRuntimeConfig();
const userStore = useUserStore();

const emit = defineEmits(["update:modelValue"]);

const selectedValue = ref(props.modelValue);
const searchTerm = ref("");
const options: Ref<Array<resumeIngredient>> = ref([]);

watch(selectedValue, (newValue) => {
  emit("update:modelValue", newValue);
});

const onChange = (event: Event) => {
  selectedValue.value = (event.target as HTMLSelectElement).value;
};

const fetchOptions = async () => {
  // Reemplazar con la lógica de llamada al backend

  const data = await fetch(
    `${config.public.backEnd}ingredient/recipe?name=${searchTerm.value}`,
    {
      headers: { Authorization: `Bearer ${userStore.getUser.token}` },
    }
  )
    .then((data) => data.json())
    .then(({ data }) => data);

  options.value =
    (data as Array<resumeIngredient>) || ([] as Array<resumeIngredient>);
};

onMounted(fetchOptions);
</script>
