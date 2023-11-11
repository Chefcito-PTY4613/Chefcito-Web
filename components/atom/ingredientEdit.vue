<script setup lang="ts">
const config = useRuntimeConfig();
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
const { getUnitTypes, set } = unitTypesStore();
if (getUnitTypes.length == 0) set();
const unitTypes = computed(() => getUnitTypes);

const { id, name, desc, flag, type, typeId } = defineProps<{
  id: string;
  name: string;
  desc: string;
  flag: number;
  type: string;
  typeId: string;
}>();
const nameEdit = ref(name);
const descEdit = ref(desc);
const flagEdit = ref(flag);
const typeEdit = ref(typeId);

const edit = async ({
  nameEdit,
  descEdit,
  flagEdit,
  typeEdit,
}: {
  nameEdit: string;
  descEdit: string;
  flagEdit: number;
  typeEdit: string;
}) => {
await fetch(`${config.public.backEnd}ingredient`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${userStore.getUser.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      name: nameEdit,
      desc: descEdit,
      stockFlag: flagEdit,
      unit: typeEdit,
    }),
  }).then((data) => data.json());
};
</script>
<template>
  <UiSheet>
    <UiSheetTrigger class="p-1 h-auto">🖊️</UiSheetTrigger>
    <UiSheetContent>
      <UiSheetHeader>
        <UiSheetTitle>Editar {{ name }}</UiSheetTitle>
        <UiSheetDescription>
          Puedes editar el nombre y cantidad de alerta.
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
            Alerta({{ type }})
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
                <UiSelectLabel>Tipo de unidad</UiSelectLabel>
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
        <UiButton @click="edit({ flagEdit, descEdit, nameEdit, typeEdit })"
          >Guardar cambios</UiButton
        >
      </div>
    </UiSheetContent>
  </UiSheet>
</template>
