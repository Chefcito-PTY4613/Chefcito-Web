<script setup lang="ts">
import { transforDate,transforDateTime } from "@/lib/utils.rata";
import { Table } from "~/lib/types";

const config = useRuntimeConfig();
const {proxy} = getCurrentInstance()

const {needDay = false} = defineProps<{
  needDay:Boolean;
}>();



const tables = ref([] as Array<Table>)
const io = proxy.$socket;

const getTables = async () => {
  const data = (await fetch(`${config.public.backEnd}table`).then((data) =>
    data.json()
  )) as Array<Table>;
  tables.value = data; 
};
function compareByNum(a: Table, b: Table) {
  return a.num - b.num;
}

io.on('table:save', (table:Table) => {
  console.log('table:save',table)
  const filterT = tables.value.filter(({_id})=>!(_id === table._id))
  tables.value = [...filterT, table].sort(compareByNum)
});


onMounted(() => {
  getTables();
});

</script>
<template>
  <div class="grid grid-cols-3 md:grid-cols-4 gap-8">
    <article class="flex w-full flex-col rounded-md max-h-[260px] p-2" 
    v-for="mesa in tables" :key="mesa._id"
    :class="mesa.active?'bg-secondary text-secondary-foreground':'bg-muted text-muted-foreground'">
      <h2>Mesa: N{{ mesa.num }}</h2>
      <h2>Personas: {{ mesa.size }} </h2>
      <div class="relative">
        <AtomQr :value="JSON.stringify({ table: mesa._id })" class="py-2" :size="150"></AtomQr>
<div v-if="!mesa.active" class="absolute m-auto w-full h-12 top-0 bottom-0 rotate-45  bg-primary-foreground rounded-lg"></div>
<div v-if="!mesa.active" class="absolute m-auto w-full h-12 top-0 bottom-0 -rotate-45  bg-primary-foreground rounded-lg"></div>
<div v-if="!mesa.active" class="absolute m-auto w-full h-12 top-0 bottom-0 bg-primary-foreground rounded-lg text-center flex items-center justify-center">Mesa usada</div>
      </div>
      <p v-if="!mesa.active" class="text-center text-xs">
        Usado desde las {{ transforDateTime(mesa.updatedAt) }}
        <p v-if="!mesa.active && needDay" class="text-center text-xs">
        Del dia {{ transforDate(mesa.updatedAt) }}
      </p>
      </p>
    </article>
  </div>
</template>
