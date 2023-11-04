<script setup lang="ts">
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
import { unitTypesStore } from "@/stores/unitTypes";
import { PaginationFetch, Ingredient } from "~/lib/types";
const {getUnitType, getUnitTypes,set} = unitTypesStore();
if (getUnitTypes.length == 0) set();

const unitTypes = computed(() => getUnitTypes);
console.log(getUnitType("64fb92e4a1ed589a9e04bd2b"))

const config = useRuntimeConfig();


interface HashTable<T> {
  [key: number]: T;
}

const usersHash: HashTable<Array<Ingredient>> = {};
const dataItems = ref([] as Array<Ingredient>);

const error = ref(".");
const name = ref("");

const currPage = ref(1);
const pages = ref(1);

async function getData(page = 1) {
  error.value = ".";
  if (usersHash[page] !== undefined) dataItems.value = usersHash[page];

  let search = "";
  if (name.value !== "") search = `&name=${name.value}`;
  else {
    search = "";
  }

  //btoa()
  const totalData = await fetch(
    `${config.public.backEnd}ingredient?page=${page}${search}`,
    {
      headers: { Authorization: `Bearer ${userStore.getUser.token}` },
    }
  ).then((data) => data.json());

  if (totalData === null) {
    error.value = ", hubo un error de carga.";
    return;
  }

  const { currentPage, data, totalPages } = totalData as PaginationFetch<Ingredient>;
  currPage.value = currentPage as number;
  pages.value = totalPages as number;
  dataItems.value = data ?? [];
}
function clean() {
  name.value = "";
  getData();
}
onMounted(() => {
  getData();
});
</script>
<template>
  <article>
    <div class="flex w-full max-w-lg items-center gap-1.5">
      <UiInput v-model="name" placeholder="Busqueda por nombre"></UiInput>
      <UiButton @click="getUsers()"> Buscar </UiButton>
      <UiButton @click="clean()"> Limpiar </UiButton>
    </div>
    <UiTable>
      <UiTableCaption>Lista de usuarios{{ error }}</UiTableCaption>
      <UiTableHeader>
        <UiTableRow>
          <UiTableHead> Nombre </UiTableHead>
          <UiTableHead>Descripción</UiTableHead>
          <UiTableHead class="text-right"> Actividad </UiTableHead>
        </UiTableRow>
      </UiTableHeader>
      <UiTableBody>
        <UiTableRow v-for="item in dataItems" key="item._id">
          <UiTableCell class="font-medium">
            {{ `${item.name}` }}
          </UiTableCell>
          <UiTableCell>{{ item.desc }}</UiTableCell>
          <UiTableCell class="text-right"> 
            {{  `${item.stock} ${getUnitType(item.unit)?.name}` }} <br/> alerta en {{ `${item.stockFlag} ${getUnitType(item.unit)?.name}` }} 
          </UiTableCell>
        </UiTableRow>
      </UiTableBody>
    </UiTable>
    <div class="py-1 h-auto">
      <UiButton
        variant="outline"
        v-for="page in Array.from(
          { length: pages },
          (value, index) => index + 1)" :key="`page-${page}`"
          @click="getData(page)"
          class="py-1 px-2 h-auto mr-2"
          :class="page==currPage?'bg-secondary':''"
          >
        {{ page }}
      </UiButton>
    </div>
  </article>
</template>
