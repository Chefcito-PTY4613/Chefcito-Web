<script setup lang="ts">
useHead({ title: "Chef" });
const { socket } = useSocket();
import { Table, Order, Process, ChefOrderFetching } from "~/lib/types";
import { useUserStore } from "@/stores/user";
import { orderTypesStore } from "@/stores/orderTypes";
import { delay } from "~/lib/utils.rata";
const userStore = useUserStore();
const config = useRuntimeConfig();

const headers = {
  Authorization: `Bearer ${userStore.getUser.token}`,
  "Content-Type": "application/json",
};

const { set, getOrderTypes, getOrderTypeName } = orderTypesStore();

if (getOrderTypes.length == 0) set();

const scrollContent: Ref<HTMLElement | null> = ref(null);
const tables = ref([] as Array<Table>);
const process = ref([] as Array<Process>);

const orders = ref([] as ChefOrderFetching[]);

const getDataTables = async () => {
  const dataTables = (await fetch(`${config.public.backEnd}table`).then(
    (data) => data.json()
  )) as Array<Table>;

  if (dataTables) {
    for (const el of dataTables) {
      tables.value.push(el);
      await delay(100);
    }
  }
};

const getDataProcess = async () => {
  const dataProcess = (await fetch(
    `${config.public.backEnd}type/proccess`
  ).then((data) => data.json())) as Array<Process>;
  if (dataProcess) {
    for (const el of dataProcess) {
      process.value.push(el);
      await delay(100);
    }
  }
};

const getDataOrder = async () => {
  const dataOrder = (await fetch(
    `${config.public.backEnd}order?type=${
      getOrderTypeName("Ordenado")?._id || ""
    }`,
    { headers }
  ).then((data) => data.json())) as Array<ChefOrderFetching>;

  if (dataOrder) {
    dataOrder.map((el) => {
      el.processResume = [];
      el.recipes.forEach(({ process }) => el.processResume.push(process));
      return el;
    });
    const dataLength = orders.value.length;
    for (let i = 0; i < dataLength; i++) {
      orders.value.shift();
      await delay(80);
    }
    for (const el of dataOrder) {
      orders.value.push(el);
      await delay(80);
    }
  }
};

const prepDataTables = (
  ordersD: ChefOrderFetching[],
  table: string
): { name: string; count: number }[] => {
  const ordersFilter = ordersD.filter(({ tableId }) => table === tableId);

  const ordersReduce = ordersFilter.reduce((prev, curr) => {
    if (!prev[curr.order.food.name]) {
      prev[curr.order.food.name] = { name: curr.order.food.name, count: 1 };
      return prev;
    }
    if (prev[curr.order.food.name]) {
      prev[curr.order.food.name].count += 1;
      return prev;
    }
    return prev;
  }, {} as { [key: string]: { name: string; count: number } });

  return Object.keys(ordersReduce).map((el) => ordersReduce[el]);
};

const prepRecipes = (
  ordersD: ChefOrderFetching[],
  proce: string
): ChefOrderFetching[] => {
  if (ordersD.length == 0) return [];
  //busco si exite en el resumen de procesos
  const ordersFilter = ordersD.filter((ord) =>
    ord.processResume.includes(proce)
  );
  if (ordersFilter.length == 0) return [];

  const ordersReduce = ordersFilter.reduce((prev, curr) => {
    const id = `${curr.tableId}-${curr.order.food._id}`;
    if (!prev[id]) {
      curr.repit = 1;
      prev[id] = curr;
    } else {
      prev[id].repit = (prev[id].repit || 0) + 1;
    }
    return prev;
  }, {} as { [key: string]: ChefOrderFetching });

  return Object.keys(ordersReduce).map((el) => ordersReduce[el]);
};

const startDrag = (event: DragEvent, item: Process) => {
  event.dataTransfer!.dropEffect = "move";
  event.dataTransfer!.effectAllowed = "move";
  event.dataTransfer!.setData("itemId", item._id);
};

const onOver = (event: DragEvent) => {
  const target = event.target as HTMLElement;
  target.style.border = "1px solid #33a06f";
};

const onLeave = (event: DragEvent) => {
  const target = event.target as HTMLElement;
  target.style.border = "";
};

const onDrop = (event: DragEvent, index: number) => {
  onLeave(event);
  const itemId = event.dataTransfer?.getData("itemId");
  const item = process.value.find((item) => item._id == itemId);
  const itemPosition = process.value.findIndex((item) => item._id == itemId);
  process.value.splice(itemPosition, 1);
  process.value.splice(index, 0, item!);
};

onMounted(() => {
  Promise.all([getDataTables(), getDataProcess(), getDataOrder()]);
});

socket.on("updatedOrder", (order) => {
  getDataOrder();
});
socket.on("table:save", (_) => {
  getDataOrder();
});
</script>
<template>
  <div class="w-full h-full flex-col select-none">
    <section class="w-full flex c-scroll overflow-auto">
      <AtomCard v-if="tables.length == 0" v-for="n in 7" :key="n">
        <UiSkeleton class="h-10 w-full mb-2"></UiSkeleton>
        <UiSkeleton :repite="5" class="h-5 w-full mb-2"></UiSkeleton>
      </AtomCard>
      <AtomCard
        v-for="table in tables"
        :key="table._id"
        :title="`Mesa ${table.num}`"
      >
        <main>
          <UiSkeleton
            v-if="
              orders.filter(({ tableId }) => table._id == tableId).length == 0
            "
            :repite="5"
            class="h-5 w-full mb-2"
          ></UiSkeleton>
          <p
            class="text-gray-700 dark:text-gray-200 font-bold"
            v-for="order in prepDataTables(orders, table._id)"
          >
            ({{ order.count }}) {{ order.name }}
          </p>
        </main>
      </AtomCard>
    </section>
    <br />
    <section
      class="w-full flex flex-row-reverse c-scroll overflow-auto rotate-180"
      ref="scrollContent"
    >
      <AtomCard
        class="drag-el"
        v-if="process.length == 0"
        v-for="n in 8"
        :key="n"
      >
        <UiSkeleton class="h-10 w-full mb-2"></UiSkeleton>
        <UiSkeleton :repite="5" class="h-5 w-full mb-2"></UiSkeleton>
      </AtomCard>
      <AtomCard
        class="rotate-180 drag-el"
        v-for="(proce, index) in process"
        :title="proce.name"
        :key="proce._id"
        draggable="true"
        @dragenter.prevent
        @dragstart="startDrag($event, proce)"
        @drop="onDrop($event, index)"
        @dragover.prevent="onOver($event)"
        @dragleave.prevent="onLeave($event)"
      >
        <div
          v-for="order in prepRecipes(orders, proce._id)"
          :key="`${proce._id}-${order.order._id}`"
        >
          <div
            v-if="
              order.recipes.filter(({ process }) => process === proce._id)
                .length > 0
            "
          >
            <p class="text-gray-800 dark:text-gray-100 font-bold">
              <strong> ( {{ order?.repit }} ) </strong>
              {{ order.order.food.name }} (M{{
                tables.find(({ _id }) => order.tableId === _id)?.num || ""
              }})
            </p>
            <p
              class="text-gray-600 dark:text-gray-300"
              v-for="reci in order.recipes.filter(
                ({ process }) => process === proce._id
              )"
            >
              {{ `- ${reci.ingredient} (${reci.amount} ${reci.unit})` }}
            </p>
            <hr />
          </div>
        </div>
      </AtomCard>
    </section>
  </div>
</template>

<style scoped lang="scss">
.drag-el {
  cursor: grab;
}
</style>
