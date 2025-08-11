import type { UserRole } from "~/types/User";

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore();

  const requiredRoles = to.meta.role as UserRole[] | undefined;

  if (
    !auth.user ||
    !requiredRoles ||
    !auth.user.roles.some((r) => requiredRoles.includes(r as UserRole))
  ) {
    return navigateTo("/unauthorized");
  }
});
