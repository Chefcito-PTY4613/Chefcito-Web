<script setup lang="ts">
import { noNullStr } from "@/lib/utils.rata";

const config = useRuntimeConfig();

import { useUserStore } from "@/stores/user";
import { useUserTypesStore } from "@/stores/userType";
const userStore = useUserStore();
const { getUserTypes, set } = useUserTypesStore();

if (getUserTypes.length == 0) set();
const userTypes = computed(() => getUserTypes);

const name = ref(""),
  lastName = ref(""),
  mail = ref(""),
  password = ref(""),
  type = ref(""),
  phone = ref(""),
  phoneCode = ref("+56"),
  err = ref("");

function cleanValues() {
  name.value = "";
  lastName.value = "";
  mail.value = "";
  password.value = "";
  type.value = "";
  phone.value = "";
  phoneCode.value = "+56";
}
const alertHide = ref(false),
alertTitle = ref(""),
  alertBody = ref("");

const createWorker = async () => {
  err.value = "";
  if (
    !noNullStr([
      name.value,
      lastName.value,
      mail.value,
      password.value,
      type.value,
      phone.value,
      phoneCode.value,
    ])
  ) {
    err.value = "Llena todos los campos.";
    return;
  }

  if (isNaN(parseInt(phone.value))) {
    err.value = "El numero tiene que ser valido .";
    return;
  }

  if (parseInt(phone.value) < 100000000 || parseInt(phone.value) > 999999999) {
    err.value = "El numero tiene que ser valido .";
    return;
  }

  const data = {
    name: name.value,
    lastName: lastName.value,
    mail: mail.value,
    password: password.value,
    userType: type.value,
    phone: {
      number: parseInt(phone.value),
      code: phoneCode.value,
    },
  };
  const headers = {
    Authorization: `Bearer ${userStore.getUser.token}`,
    "Content-Type": "application/json",
  };
  await fetch(`${config.public.backEnd}worker`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  }).then((response) => {
    if (response.ok) {
      return response.json(); // Si la respuesta es exitosa, parsea la respuesta JSON
    }
    throw new Error("Error en la solicitud.");
  });
  cleanValues();
};
</script>
<template>

  <div class="grid w-full max-w-sm items-center gap-1.5">
  <div class="grid w-full max-w-sm items-center gap-1.5">
    <UiLabel>Nombre</UiLabel>
    <UiInput id="name" v-model="name"></UiInput>
  </div>

  <div class="grid w-full max-w-sm items-center gap-1.5">
    <UiLabel>Apellido</UiLabel>
    <UiInput id="lastName" v-model="lastName"></UiInput>
  </div>

  <div class="grid w-full max-w-sm items-center gap-1.5">
    <UiLabel>Mail</UiLabel>
    <UiInput id="mail" v-model="mail"></UiInput>
  </div>

  <div class="grid w-full max-w-sm items-center gap-1.5">
    <UiLabel>Celular</UiLabel>
    <div class="flex">
      <UiSelect id="phoneCode" v-model="phoneCode">
        <UiSelectTrigger class="w-2/5">
          <UiSelectValue placeholder="Codigo" />
        </UiSelectTrigger>
        <UiSelectContent>
          <UiSelectGroup>
            <UiSelectLabel>Codigo de pais</UiSelectLabel>
            <UiSelectItem value="+56"> Chile(+56) </UiSelectItem>
            <UiSelectItem value="+54"> Argentina(+54) </UiSelectItem>
            <UiSelectItem value="+51"> Peru(+51) </UiSelectItem>
            <UiSelectItem value="+591"> Bolivia(+591) </UiSelectItem>
            <UiSelectItem value="+55"> Brazil(+55) </UiSelectItem>
          </UiSelectGroup>
        </UiSelectContent>
      </UiSelect>
      <UiInput class="w-3/5" type="number" id="phone" v-model="phone"></UiInput>
    </div>
  </div>

  <div class="grid w-full max-w-sm items-center gap-1.5">
    <UiLabel>Contraseña</UiLabel>
    <UiInput type="password" id="password" v-model="password"></UiInput>
  </div>

  <div class="grid w-full max-w-sm items-center gap-1.5">
    <UiLabel>Tipo</UiLabel>
    <UiSelect id="type" v-model="type">
      <UiSelectTrigger class="w-full">
        <UiSelectValue placeholder="Selecciona un area" />
      </UiSelectTrigger>
      <UiSelectContent>
        <UiSelectGroup>
          <UiSelectLabel>Tipo de usuario</UiSelectLabel>
          <UiSelectItem
            v-for="li in userTypes ?? []"
            :key="li._id"
            :value="li._id"
          >
            {{ li.desc }}
          </UiSelectItem>
        </UiSelectGroup>
      </UiSelectContent>
    </UiSelect>
  </div>
  <br />
</div>
  <p
    v-if="err !== ''"
    class="text-accent-foreground bg-accent rounded-md px-3 py-2"
  >
    {{ err }}
  </p>
  <br v-if="err !== ''" />
  <UiButton @click="createWorker"> Crear Usuario </UiButton>
  <br />

</template>
