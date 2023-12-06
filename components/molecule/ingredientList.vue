<script setup lang="ts">
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
import { delay } from "@/lib/utils.rata";
import { unitTypesStore } from "@/stores/unitTypes";
import { PaginationFetch, Ingredient } from "~/lib/types";
const { getUnitType, getUnitTypes, set } = unitTypesStore();
if (getUnitTypes.length == 0) set();
const { socket } = useSocket();

const config = useRuntimeConfig();

const dataItems = ref([] as Array<Ingredient>);

const error = ref(".");
const name = ref("");
const currPage = ref(1);
const pages = ref(1);

async function getData(page = 1) {
  error.value = ".";

  let search = "";
  if (name.value !== "") search = `&name=${name.value}`;
  else {
    search = "";
  }

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

  if (data) {
    const dataLength = dataItems.value.length
    for (let i = 0; i < dataLength; i++) {
      dataItems.value.shift();
      await delay(80);
    }
    for (const el of data) {
      dataItems.value.push(el);
      await delay(80);
    }
  }
}
function clean() {
  name.value = "";
  getData();
}

onMounted(() => {
  getData();
});

socket.on("ingredient:update", (data: Ingredient) => {
  const dataFilter = dataItems.value.filter(({ _id }) => _id !== data._id);
  dataItems.value = dataFilter
  dataItems.value.unshift(data)
});

socket.on("ingredient:changeStock", (data: Ingredient) => {
  const dataIndex = dataItems.value.findIndex(({ _id }) => _id === data._id);
  if(dataIndex>0)dataItems.value[dataIndex] = data;
});
</script>
<template>
  <article>
    <div class="grid grid-cols-10 items-center gap-2 items-center">
      <UiInput
        class="col-span-6"
        v-model="name"
        placeholder="Busqueda por nombre"
      ></UiInput>
      <div class="col-span-1"></div>
      <UiButton class="col-span-1" @click="getData()"> Buscar </UiButton>
      <UiButton class="col-span-1" @click="clean()"> Limpiar </UiButton>
      <AtomIngredientAdd></AtomIngredientAdd>
    </div>
    <UiTable>
      <UiTableCaption>Lista de ingredientes{{ error }}</UiTableCaption>
      <UiTableHeader>
        <UiTableRow>
          <UiTableHead> Nombre </UiTableHead>
          <UiTableHead>Descripción</UiTableHead>
          <UiTableHead> Stock </UiTableHead>
          <UiTableHead class="text-right"> Edit </UiTableHead>
        </UiTableRow>
      </UiTableHeader>
      <UiTableBody>
        <UiTableRow v-if="dataItems.length === 0">Cargando datos...</UiTableRow>
        <UiTableRow v-else v-for="item in dataItems" class="fade-blur" key="item._id">
          <UiTableCell class="font-medium">
            {{ `${item.name}` }}
          </UiTableCell>
          <UiTableCell>{{ item.desc }}</UiTableCell>
          <UiTableCell class="text-right">
            <p
              class="py-1 px-2 rounded-sm"
              :class="
                item.stock < item.stockFlag
                  ? 'text-destructive bg-destructive-foreground'
                  : ''
              "
            >
              {{ `${item.stock} ${getUnitType(item.unit)?.name}` }}
            </p>
          </UiTableCell>
          <UiTableCell class="flex justify-end align-middle">
            <AtomIngredientEdit
              :flag="item.stockFlag"
              :id="item._id"
              :name="item.name"
              :type="getUnitType(item.unit)?.name||''"
              :typeId="item.unit"
              :desc="item.desc"
            ></AtomIngredientEdit>
          </UiTableCell>
        </UiTableRow>
      </UiTableBody>
    </UiTable>
    <div class="py-1 h-auto">
      <UiButton
        variant="outline"
        v-for="page in Array.from(
          { length: pages },
          (value, index) => index + 1
        )"
        :key="`page-${page}`"
        @click="getData(page)"
        class="py-1 px-2 h-auto mr-2"
        :class="page == currPage ? 'bg-secondary' : ''"
      >
        {{ page }}
      </UiButton>
    </div>
  </article>
</template>
