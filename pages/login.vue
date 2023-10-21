<script setup lang="ts">
// definePageMeta({
//   middleware: 'auth'
// })
const config = useRuntimeConfig();

import { useUserStore } from "@/stores/user";

useHead({ title: "LogIn" });
const pass = ref("");
const mail = ref("");
let alert = ref("");

const userStore = useUserStore();

async function login() {
  const { data, error } = await useFetch(`${config.public.backEnd}login`, {
    method:'post',
    body: { mail: mail.value, password: pass.value },
  });
  if(error.value !== null) return alert.value = error.value.data.msg;
  userStore.set(data.value as { user: { userType: any }; token: object }||null);
  navigateTo('/')

}
</script>
<template>
  <section class="login">
    <h1 class="text-xl">Chefcito Trabajadores</h1>
    <div class="login__form">
      <UiLabel>Correo</UiLabel>
      <UiInput
        v-model="mail"
        type="email"
        placeholder="ejemplo@gmail.com"
      ></UiInput>
      <br>
      <UiLabel>Contraseña</UiLabel>
      <UiInput
        v-model="pass"
        type="password"
        placeholder="*************"
      ></UiInput>
      {{ alert }}
      <br>
      <div class="flex justify-center">

        <UiButton variant="outline" @click="login()" >Login</UiButton>
      </div>
    </div>
  </section>
</template>
