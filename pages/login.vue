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
    <h1 class="">Chefcito Trabajadores</h1>
    <div class="login__form">
      <AtomInput
        v-model="mail"
        label="Correo"
        type="email"
        placeholder="ejemplo@gmail.com"
      ></AtomInput>
      <AtomInput
        v-model="pass"
        label="Contraseña"
        type="password"
        placeholder="******"
      ></AtomInput>
      {{ alert }}
      <button @click="login()" class="login__form-btn">Login</button>
    </div>
  </section>
</template>
