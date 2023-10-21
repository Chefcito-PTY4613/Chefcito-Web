<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { useUserTypesStore } from "@/stores/userType";
const userStore = useUserStore();
const { getUserTypes, getUserType, set } = useUserTypesStore();

if (getUserTypes.length == 0) set();

const userTypes = computed(() => getUserTypes);

const config = useRuntimeConfig();

interface person {
  active?: boolean;
  createdAt?: Date;
  lastName?: string;
  mail?: string;
  name?: string;
  password?: string;
  updatedAt?: Date;
  userType?: string;
  verified?: boolean;
  _id?: string;
}
interface HashTable<T> {
  [key: number]: T;
}
interface usersFetch {
  currentPage?: number;
  customers?: Array<person>;
  total?: number;
  totalPages?: number;
}

const usersHash: HashTable<Array<person>> = {};
const users = ref([] as Array<person>);
const error = ref(".");
const name = ref("");

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
    `${config.public.backEnd}worker?page=${page}${search}`,
    {
      headers: { Authorization: `Bearer ${userStore.getUser.token}` },
    }
  ).then((data) => data.json());

  if (usersData === null) {
    error.value = ", hubo un error de carga.";
    return;
  }

  const { currentPage, customers, total, totalPages } = usersData as usersFetch;

  users.value = customers ?? [];
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
        <UiTableRow v-for="item in users" key="item._id">
          <UiTableCell class="font-medium">
            {{ `${item.name} ${item.lastName}` }}
          </UiTableCell>
          <UiTableCell>{{ item.mail }}</UiTableCell>
          <UiTableCell>{{ getUserType(item.userType).desc ?? "" }}</UiTableCell>
          <UiTableCell class="text-right"> $250.00 </UiTableCell>
        </UiTableRow>
      </UiTableBody>
    </UiTable>
  </article>
</template>
