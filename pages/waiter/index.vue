<script setup lang="ts">
useHead({ title: "Mesas Disponibles" });
import { useUserStore } from "@/stores/user";
import { ActiveReservation, Table } from "@/lib/types";
import { transforDateTime } from "@/lib/utils.rata";
import { orderTypesStore } from "@/stores/orderTypes";

const { set, getOrderTypes } = orderTypesStore();
const userStore = useUserStore();
const config = useRuntimeConfig();

if (getOrderTypes.length == 0) set();

const tables = ref([] as Array<Table>);
const reservation = ref({} as { [key: string]: ActiveReservation });

const getTables = async () => {
  const data = (await fetch(`${config.public.backEnd}table`).then((data) =>
    data.json()
  )) as Array<Table>;
  const actives = data.filter(({ active }) => active == false);
  tables.value = actives;

  actives.forEach((el) => {
    activeReservation(el._id);
  });
};

const activeReservation = async (table: string) => {
  const data = await fetch(`${config.public.backEnd}reservation/management`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${userStore.getUser.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ table }),
  })
    .then((data) => data.json())
    .then((data) => data as ActiveReservation);
  reservation.value[table] = data;
};

onMounted(() => {
  getTables();
});
</script>
<template>
  <div class="grid grid-cols-1 w-full max-w-2xl">
    <MoleculeAcordionTables
      v-for="mesa in tables"
      :key="mesa._id"
      :table-id="mesa._id"
      :table-num="mesa.num"
      :table-persons="mesa.size"
      :table-time="transforDateTime(mesa.updatedAt)"
    >
      <p v-if="!reservation[mesa._id]">No se encuentran datos</p>
      <article class="flex justify-between items-center" v-for="order in reservation[mesa._id].orders" :key="order._id">
        <div>
          <h3>
            {{ order.food.name }}
          </h3>
          <img
            class="h-12 max-w-full rounded-md"
            :src="order.food.img"
            :alt="order.food.img"
          />
        </div>
        <UiSelect id="phoneCode">
          <UiSelectTrigger class="w-2/5">
            <UiSelectValue placeholder="Estado" />
          </UiSelectTrigger>
          <UiSelectContent>
            <UiSelectGroup>
              <UiSelectLabel>Estado de la orden</UiSelectLabel>
              <UiSelectItem
                v-for="orderType in getOrderTypes"
                :key="orderType._id"
                :value="orderType._id"
              >
                {{ orderType.name }}
              </UiSelectItem>
            </UiSelectGroup>
          </UiSelectContent>
        </UiSelect>
      </article>
    </MoleculeAcordionTables>
  </div>
</template>
