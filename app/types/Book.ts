import type { Author } from "./Author";
import type { Category } from "./Category";

export interface Book {
  id: number;
  title: string;
  description?: string | null;
  publishedAt?: string | null;
  author: Author;
  categories: Category[];
}
