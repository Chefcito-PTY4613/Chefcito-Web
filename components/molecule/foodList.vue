<script setup lang="ts">
import { PaginationFetch, Food } from "~/lib/types";

const userStore = useUserStore();
const { setFood } = foodStore()

import { foodTypesStore } from "@/stores/foodTypes";
const { getFoodType, getFoodTypes, set } = foodTypesStore();
if (getFoodTypes.length == 0) set();

const { socket } = useSocket();
const config = useRuntimeConfig();

const dataItems = ref([] as Array<Food>);
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

  Array.from({ length: dataItems.value.length }, () => dataItems.value.pop());

  const totalData = await fetch(
    `${config.public.backEnd}food/pagination?page=${page}${search}`,
    {
      headers: { Authorization: `Bearer ${userStore.getUser.token}` },
    }
  ).then((data) => data.json());

  if (totalData === null) {
    error.value = ", hubo un error de carga.";
    return;
  }

  const { currentPage, data, totalPages } = totalData as PaginationFetch<Food>;
  currPage.value = currentPage as number;
  pages.value = totalPages as number;
  data?.map((el) => dataItems.value.push(el));
}

function clean() {
  name.value = "";
  getData();
}

const receta = async(data:Food)=>{
  setFood(data)
  await navigateTo({ path: `/ingredients/${data._id}` })

  
}

socket.on('food:save',(data: Food) => {
  const dataFilter = dataItems.value.filter(({ _id }) => _id !== data._id);
  dataItems.value = dataFilter
  dataItems.value.unshift(data)
})


onMounted(() => {
  getData();
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
      <AtomFoodAdd></AtomFoodAdd>
    </div>
    <UiTable>
      <UiTableCaption>Lista de comidas{{ error }}</UiTableCaption>
      <UiTableHeader>
        <UiTableRow>
          <UiTableHead> Imagen </UiTableHead>
          <UiTableHead> Tipo </UiTableHead>
          <UiTableHead> Nombre </UiTableHead>
          <UiTableHead>Descripción</UiTableHead>
          <UiTableHead>Precio</UiTableHead>
          <UiTableHead class="text-right"> Edit </UiTableHead>
        </UiTableRow>
      </UiTableHeader>
      <UiTableBody>
        <UiTableRow v-if="dataItems.length === 0">Cargando datos...</UiTableRow>
        <UiTableRow v-else v-for="item in dataItems" key="item._id">
          <UiTableCell>
            <img :id="`img-${item._id}`" class="rounded-3xl" loading="lazy" :src="item.img"  />
          </UiTableCell>
          <UiTableCell>
            <p class="py-1 px-2 rounded-sm" :class="''">
              {{ ` ${getFoodType(item.type)?.name}` }}
            </p>
          </UiTableCell>
          <UiTableCell class="font-medium">
            {{ `${item.name}` }}
          </UiTableCell>
          <UiTableCell>{{ item.desc }}</UiTableCell>
          <UiTableCell>${{ item.price }}</UiTableCell>
          <UiTableCell class="grid grid-rows-2 gap-2 align-middle ">
            <UiButton @click="receta(item)">
              Receta
            </UiButton>
            <AtomFoodEdit
              :id="item._id"
              :name="item.name"
              :desc="item.desc"
              :img="item.img"
              :price="item.price"
              :type="getFoodType(item.type)?.name||''"
              :typeId="item.type"
            ></AtomFoodEdit>
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
