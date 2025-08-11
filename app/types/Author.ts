import type { Book } from "./Book";

export interface Author {
  id: number;
  firstName: string;
  lastName: string;
  birthDate?: string | null;
  books?: Book[];
}
