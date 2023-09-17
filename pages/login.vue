<script setup lang="ts">
// definePageMeta({
//   middleware: 'auth'
// })

import { useUserStore } from "@/stores/user";
useHead({ title: "LogIn" });
const pass = ref("");
const mail = ref("");
let error = ref("");

const dataFetch = useResp();
const userStore = useUserStore();

async function login() {
  const resp = await dataFetch.fetchData({
    path: "login",
    method: "POST",
    headers: {},
    body: { mail: mail.value, password: pass.value },
  });
  if (resp?.msg) error.value = resp.msg;

  userStore.set(resp);
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
      {{ error }}
      <button @click="login()" class="login__form-btn">Login</button>
    </div>
  </section>
</template>
