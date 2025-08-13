export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore();

  const protectedPaths = [
    "/admin",
    "/public/books",
    "/public/authors",
    "/public/categories",
  ];

  // Si la route commence par un chemin protégé ET que l'utilisateur n'est pas connecté
  if (
    protectedPaths.some((path) => to.path.startsWith(path)) &&
    !auth.isAuthenticated
  ) {
    return navigateTo("/auth/login");
  }
});
