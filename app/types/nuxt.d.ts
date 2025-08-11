import "nuxt/app";
import type { UserRole } from "./User";

declare module "nuxt/app" {
  interface PageMeta {
    role?: UserRole[];
  }
}
