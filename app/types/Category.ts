import type { Book } from "./Book";

export interface Category {
  id: number;
  name: string;
  description?: string | null;
  books?: Book[];
}
