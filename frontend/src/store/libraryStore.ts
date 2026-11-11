
import { createStore } from "./createStore";

// Books
export type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  copies: number;
  available: number;
};

const booksStore = createStore<Book[]>(
  "schoolerp:pages_admin_library_books_tsx:books",
  () => [],
  (saved) => (Array.isArray(saved) ? (saved as Book[]) : null)
);

export const useBooks = () => booksStore.useState();
export const getBooks = () => booksStore.get();
export const setBooks = booksStore.set;

// Members
export type Member = {
  id: string;
  name: string;
  type: "Student" | "Staff";
  className: string;
  booksIssued: number;
  active: boolean;
};

const membersStore = createStore<Member[]>(
  "schoolerp:pages_admin_library_members_tsx:members",
  () => [],
  (saved) => (Array.isArray(saved) ? (saved as Member[]) : null)
);

export const useMembers = () => membersStore.useState();
export const getMembers = () => membersStore.get();
export const setMembers = membersStore.set;

// Transactions
export type Transaction = {
  id: number;
  memberId: string;
  bookId: string;
  issueDate: string;
  dueDate: string;
  returned: boolean;
};

const transactionsStore = createStore<Transaction[]>(
  "schoolerp:pages_admin_library_issuereturn_tsx:transactions",
  () => [],
  (saved) => (Array.isArray(saved) ? (saved as Transaction[]) : null)
);

export const useTransactions = () => transactionsStore.useState();
export const getTransactions = () => transactionsStore.get();
export const setTransactions = transactionsStore.set;

// Fines
export type Fine = {
  id: number;
  member: string;
  book: string;
  daysLate: number;
  paid: boolean;
};

const finesStore = createStore<Fine[]>(
  "schoolerp:pages_admin_library_fines_tsx:fines",
  () => [],
  (saved) => (Array.isArray(saved) ? (saved as Fine[]) : null)
);

export const useFines = () => finesStore.useState();
export const getFines = () => finesStore.get();
export const setFines = finesStore.set;



// Authors
export type Author = {
  id: string;
  name: string;
  country: string;
  books: number;
};

const authorsStore = createStore<Author[]>(
  "schoolerp:pages_admin_library_authors",
  () => [],
  (saved) => (Array.isArray(saved) ? (saved as Author[]) : null)
);

export const useAuthors = () => authorsStore.useState();
export const getAuthors = () => authorsStore.get();
export const setAuthors = authorsStore.set;



// Acquisitions
export type OrderStatus = "Ordered" | "Received";

export type Acquisition = {
  id: string;
  title: string;
  author: string;
  supplier: string;
  quantity: number;
  price: number;
  orderDate: string;
  status: OrderStatus;
};

const acquisitionsStore = createStore<Acquisition[]>(
  "schoolerp:pages_admin_library_acquisitions",
  () => [],
  (saved) => (Array.isArray(saved) ? (saved as Acquisition[]) : null)
);

export const useAcquisitions = () => acquisitionsStore.useState();
export const getAcquisitions = () => acquisitionsStore.get();
export const setAcquisitions = acquisitionsStore.set;


// Book Copies
export type CopyStatus =
  | "Available"
  | "Issued"
  | "Lost"
  | "Damaged"
  | "Under Repair";

export type BookCopy = {
  id: string;
  title: string;
  status: CopyStatus;
};

const bookCopiesStore = createStore<BookCopy[]>(
  "schoolerp:pages_admin_library_book_copies",
  () => [],
  (saved) => (Array.isArray(saved) ? (saved as BookCopy[]) : null)
);

export const useBookCopies = () => bookCopiesStore.useState();
export const getBookCopies = () => bookCopiesStore.get();
export const setBookCopies = bookCopiesStore.set;


const categoriesStore = createStore<string[]>(
  "schoolerp:library:categories",
  () => [],
  (saved) => (Array.isArray(saved) ? (saved as string[]) : null)
);

export const useLibraryCategories = () => categoriesStore.useState();
export const getLibraryCategories = () => categoriesStore.get();
export const setLibraryCategories = categoriesStore.set;