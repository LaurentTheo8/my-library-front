import { navigateTo } from "#app";
import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore();

  // Liste des routes publiques
  const publicPages = ["/auth/login", "/auth/register", "/about"];

  if (!auth.isAuthenticated && !publicPages.includes(to.path)) {
    return navigateTo("/auth/login");
  }
});
