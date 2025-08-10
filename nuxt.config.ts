import { fileURLToPath } from "node:url";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  alias: {
    "@": fileURLToPath(new URL("./", import.meta.url)), // Racine du projet
    "@components": fileURLToPath(new URL("./components", import.meta.url)),
    "@layouts": fileURLToPath(new URL("./layouts", import.meta.url)),
    "@pages": fileURLToPath(new URL("./pages", import.meta.url)),
    "@assets": fileURLToPath(new URL("./assets", import.meta.url)),
    "@utils": fileURLToPath(new URL("./utils", import.meta.url)),
    "@store": fileURLToPath(new URL("./store", import.meta.url)),
    "@types": fileURLToPath(new URL("./types", import.meta.url)),
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/google-fonts",
  ],

  googleFonts: {
    families: {
      Montserrat: true,
    },
  },
});
