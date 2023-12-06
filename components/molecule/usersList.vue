<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { useUserTypesStore } from "@/stores/userType";
import { PaginationFetch,User } from "~/lib/types";
import { delay } from "~/lib/utils.rata";
const userStore = useUserStore();
const { getUserTypes, getUserType, set } = useUserTypesStore();

if (getUserTypes.length == 0) set();

const userTypes = computed(() => getUserTypes);

const config = useRuntimeConfig();


interface HashTable<T> {
  [key: number]: T;
}

const usersHash: HashTable<Array<User>> = {};
const users = ref([] as Array<User>);
const error = ref(".");
const name = ref("");

const currPage = ref(1);
const pages = ref(1);

async function getUsers(page = 1) {
  error.value = ".";
  if (usersHash[page] !== undefined) users.value = usersHash[page];

  let search = "";
  if (name.value !== "") search = `&name=${name.value}`;
  else {
    search = "";
  }

  //btoa()
  const usersData = await fetch(
    `${config.public.backEnd}user?page=${page}${search}`,
    {
      headers: { Authorization: `Bearer ${userStore.getUser.token}` },
    }
  ).then((data) => data.json());

  if (usersData === null) {
    error.value = ", hubo un error de carga.";
    return;
  }

  const { currentPage, data, totalPages } = usersData as PaginationFetch<User>;

  currPage.value = currentPage as number;
  pages.value = totalPages as number;
  if (data) {
    const dataLength = users.value.length
    for (let i = 0; i < dataLength; i++) {
      users.value.shift();
      await delay(80);
    }
    for (const el of data) {
      users.value.push(el);
      await delay(80);
    }
  }
}
function clean() {
  name.value = "";
  getUsers();
}
onMounted(() => {
  getUsers();
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
          <UiTableHead>Mail</UiTableHead>
          <UiTableHead>Tipo</UiTableHead>
          <UiTableHead class="text-right"> Actividad </UiTableHead>
        </UiTableRow>
      </UiTableHeader>
      <UiTableBody>
        <UiTableRow v-for="item in users" class="fade-blur" key="item._id">
          <UiTableCell class="font-medium">
            {{ `${item.name} ${item.lastName}` }}
          </UiTableCell>
          <UiTableCell>{{ item.mail }}</UiTableCell>
          <UiTableCell>{{ getUserType(item.userType).desc ?? "" }}</UiTableCell>
          <UiTableCell class="text-right">
            {{ item.active ? "Activo" : "Baneado" }}
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
          @click="getUsers(page)"
          class="py-1 px-2 h-auto mr-2"
          :class="page==currPage?'bg-secondary':''"
          >
        {{ page }}
      </UiButton>
    </div>
  </article>
</template>
