<script setup>
const mYRoutes = useMYRoutes()
</script>
<template>
  <header class="header">
    <div class="header__container">
      <nav class="header__nav-bar">
        <nuxt-link to="/">Home</nuxt-link>
        <nuxt-link to="/login">Login</nuxt-link>
      </nav>
      <AtomThemeButton></AtomThemeButton>
    </div>
  </header>
</template>
