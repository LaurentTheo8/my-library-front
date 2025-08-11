import { navigateTo } from "#app";
import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore();

  if (to.path.startsWith("/admin") && !auth.isAuthenticated) {
    return navigateTo("/auth/login");
  }
});
