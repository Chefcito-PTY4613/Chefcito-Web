import { useUserStore } from "@/stores/user";

export default defineNuxtRouteMiddleware((to, from) => {
    // isAuthenticated() is an example method verifying if a user is authenticated
    
    const userStore = useUserStore();
    
    if (userStore.getUser.token) {
      return navigateTo('/login')
    }
  })
  