<script setup lang="ts">
useHead({ title: "Mesas Disponibles" });

import { useUserStore } from "@/stores/user";
import { ActiveReservation, Order, Table } from "@/lib/types";
import { transforDateTime } from "@/lib/utils.rata";
import { orderTypesStore } from "@/stores/orderTypes";

const { set, init, getOrderTypes } = orderTypesStore();
init()
const userStore = useUserStore();
const config = useRuntimeConfig();

const { socket } = useSocket();


if (getOrderTypes.length == 0) set();

const tables = ref([] as Array<Table>);
const reservation = ref({} as { [key: string]: ActiveReservation });
const orderStatus = ref({} as { [key: string]: string });

const getTables = async () => {
  const data = (await fetch(`${config.public.backEnd}table`).then((data) =>
    data.json()
  )) as Array<Table>;
  const actives = data.filter(({ active }) => active == false);
  tables.value = actives;
  //tables.value = data;
  //data.forEach((el) => {activeReservation(el._id);});
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

  if (!data.msg) {
    orderStatus.value = data.orders.reduce(
      (prev, curr) => ({
        ...prev,
        [curr._id]: curr.status._id,
      }),
      {} as { [key: string]: string }
    );
    reservation.value[table] = data;
  }
};

const forceEnd = async (id: string, table: string) => {
  const data = await fetch(`${config.public.backEnd}sale/pay/forced/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${userStore.getUser.token}`,
    },
  })
    .then((data) => data.json())
    .then((data) => data);
  if (data?.msg)
    if (data.msg == "Venta realizada") {
      tables.value = tables.value.filter(({ _id }) => !(table === _id));
    }
};

const changeStatus = (orderId: string, statusId: string) =>
  fetch(`${config.public.backEnd}order/${orderId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${userStore.getUser.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: statusId }),
  });

  socket.on("table:save", (table: Table) => {
  const indexT = tables.value.findIndex(({ _id }) => table._id === _id);
  if (table.active) {
    tables.value = [...tables.value];
  }
  if (indexT === -1) {
    tables.value.push(table);
    activeReservation(table._id);
  }
});

socket.on("updatedOrder", (order: Order) => {
  if (orderStatus.value[order._id])
    orderStatus.value[order._id] = order.status._id;
});

onMounted(() => {
  getTables();
});
</script>
<template>
  <div class="grid grid-cols-1 w-full max-w-2xl">
    <div v-for="mesa in tables">
      <MoleculeAcordionTables
        :key="mesa._id"
        :table-id="mesa._id"
        :table-num="mesa.num"
        :table-persons="mesa.size"
        :table-time="transforDateTime(mesa.updatedAt)"
      >
        <p v-if="!reservation[mesa._id]">No se encuentran datos</p>
        <article
          class="flex justify-between items-center py-2 w-full"
          v-for="order in reservation[mesa._id].orders"
          :key="order._id"
        >
          <div
            class="min-h-8 h-full max-h-14 mr-2 overflow-clip aspect-square rounded-md"
          >
            <img class="h-full" :src="order.food.img" :alt="order.food.img" />
          </div>
          <div class="w-full">
            <h3>
              {{ order.food.name }}
            </h3>
            <h3>
              {{ order.desc }}
            </h3>
          </div>
          <UiSelect
            v-model="orderStatus[order._id]"
            @select="changeStatus"
          >
            <UiSelectTrigger class="w-2/5 item">
              <UiSelectValue placeholder="Estado" />
            </UiSelectTrigger>
            <UiSelectContent :value="order.status">
              <UiSelectGroup>
                <UiSelectLabel>Estado de la orden</UiSelectLabel>
                <UiSelectItem
                  v-for="orderType in getOrderTypes"
                  :key="`${order._id}-${orderType._id}`"
                  :value="orderType._id"
                  @click="changeStatus(order._id, orderType._id)"
                >
                  {{ orderType.name }}
                </UiSelectItem>
              </UiSelectGroup>
            </UiSelectContent>
          </UiSelect>
        </article>
        <br />
        <div>
          <UiButton
            variant="default"
            @click="forceEnd(reservation[mesa._id].sale._id, mesa._id)"
          >
            Forzar término
          </UiButton>
        </div>
      </MoleculeAcordionTables>
      <br />
    </div>
    <div v-if="tables.length === 0">
      <h1>No se encuentran mesas ocupadas</h1>
    </div>
  </div>
</template>
