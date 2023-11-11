<script setup lang="ts">
const config = useRuntimeConfig();
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
const { getUnitTypes, set } = unitTypesStore();
if (getUnitTypes.length == 0) set();
const unitTypes = computed(() => getUnitTypes);


const nameEdit = ref("");
const descEdit = ref("");
const flagEdit = ref(0);
const initEdit = ref(0);
const typeEdit = ref("");

const edit = async ({
  nameEdit,
  descEdit,
  flagEdit,
  initEdit,
  typeEdit,
}: {
  nameEdit: string;
  descEdit: string;
  flagEdit: number;
  initEdit:number;
  typeEdit: string;
}) => {
await fetch(`${config.public.backEnd}ingredient`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${userStore.getUser.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: nameEdit,
      desc: descEdit,
      stock: initEdit,
      stockFlag: flagEdit,
      unit: typeEdit,
    }),
  }).then((data) => data.json());
};
</script>
<template>
  <UiSheet>
    <UiSheetTrigger>Añadir</UiSheetTrigger>
    <UiSheetContent>
      <UiSheetHeader>
        <UiSheetTitle>Añadir ingrediente</UiSheetTitle>
        <UiSheetDescription>
          El.
        </UiSheetDescription>
      </UiSheetHeader>
      <div class="grid gap-5 py-5">
        <div class="grid grid-cols-5 items-center gap-5">
          <UiLabel for="name" class="col-span-2 text-right"> Nombre </UiLabel>
          <UiInput
            id="name"
            v-model="nameEdit"
            :value="nameEdit"
            class="col-span-3"
          ></UiInput>
        </div>
        <div class="grid grid-cols-5 items-center gap-5">
          <UiLabel for="flag" class="col-span-2 text-right">
            Stock inicial
          </UiLabel>
          <UiInput
            type="number"
            id="flag"
            v-model="initEdit"
            :value="initEdit"
            class="col-span-3"
          ></UiInput>
        </div>
        <div class="grid grid-cols-5 items-center gap-5">
          <UiLabel for="flag" class="col-span-2 text-right">
            Alerta
          </UiLabel>
          <UiInput
            type="number"
            id="flag"
            v-model="flagEdit"
            :value="flagEdit"
            class="col-span-3"
          ></UiInput>
        </div>
        <div class="grid grid-cols-5 items-center gap-5">
          <UiLabel for="type" class="col-span-2 text-right"> Tipo</UiLabel>
          <UiSelect class="col-span-3" id="type" v-model="typeEdit">
            <UiSelectTrigger class="col-span-3">
              <UiSelectValue placeholder="Tipo de unidad" />
            </UiSelectTrigger>
            <UiSelectContent>
              <UiSelectGroup>
                <UiSelectLabel>Selecciona unidad</UiSelectLabel>
                <UiSelectItem
                  v-for="unit in unitTypes"
                  :key="unit._id"
                  :value="unit._id"
                >
                  {{ unit.name }}
                </UiSelectItem>
              </UiSelectGroup>
            </UiSelectContent>
          </UiSelect>
        </div>
        <div class="grid grid-cols-5 items-center gap-5">
          <UiLabel for="desc" class="col-span-2 text-left">
            Descripción
          </UiLabel>
          <UiTextarea
            id="desc"
            v-model="descEdit"
            :value="descEdit"
            class="col-span-5"
          ></UiTextarea>
        </div>
        <UiButton @click="edit({ initEdit,flagEdit, descEdit, nameEdit, typeEdit })"
          >Guardar Ingrediente</UiButton
        >
      </div>
    </UiSheetContent>
  </UiSheet>
</template>
