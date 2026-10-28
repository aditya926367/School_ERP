// src/pages/admin/library/Books.tsx
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { BookOpen, LibraryBig, Plus, X } from "lucide-react";

import DataTable from "../../../components/common/DataTable";
import FilterSelect from "../../../components/common/FilterSelect";
import PageHeader from "../../../components/common/PageHeader";
import Pagination from "../../../components/common/Pagination";
import SearchBar from "../../../components/common/SearchBar";
import StatusBadge from "../../../components/common/StatusBadge";
import SummaryCard from "../../../components/common/SummaryCard";

type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  copies: number;
  available: number;
};

const initialBooks: Book[] = [
  {
    id: "B001",
    title: "Wings of Fire",
    author: "A.P.J. Abdul Kalam",
    category: "Biography",
    copies: 5,
    available: 3,
  },
  {
    id: "B002",
    title: "Concept of Physics",
    author: "H.C. Verma",
    category: "Science",
    copies: 8,
    available: 0,
  },
  {
    id: "B003",
    title: "Gitanjali",
    author: "Rabindranath Tagore",
    category: "Poetry",
    copies: 4,
    available: 4,
  },
  {
    id: "B004",
    title: "Discovery of India",
    author: "Jawaharlal Nehru",
    category: "History",
    copies: 3,
    available: 1,
  },
  {
    id: "B005",
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    category: "Finance",
    copies: 6,
    available: 2,
  },
];

const categories = [
  "Science",
  "History",
  "Biography",
  "Poetry",
  "Finance",
  "Fiction",
  "Other",
];

const PAGE_SIZES = [5, 10, 25, 50];

const inputStyle =
  "h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#27348b] focus:ring-2 focus:ring-blue-100";

const emptyForm = {
  title: "",
  author: "",
  category: "Science",
  copies: "1",
};

export default function Books() {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  // Search and filtering
  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return books.filter((book) => {
      const matchesSearch = [book.id, book.title, book.author].some(
        (value) => value.toLowerCase().includes(query)
      );

      const matchesCategory =
        categoryFilter === "All" || book.category === categoryFilter;

      const matchesAvailability =
        availabilityFilter === "All" ||
        (availabilityFilter === "Available"
          ? book.available > 0
          : book.available === 0);

      return (
        matchesSearch && matchesCategory && matchesAvailability
      );
    });
  }, [books, search, categoryFilter, availabilityFilter]);

  // Pagination calculations
  const totalPages = Math.max(
    1,
    Math.ceil(filteredBooks.length / pageSize)
  );

  const safePage = Math.min(page, totalPages);

  const pagedBooks = filteredBooks.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  // Summary calculations
  const totalCopies = books.reduce(
    (sum, book) => sum + book.copies,
    0
  );

  const availableCopies = books.reduce(
    (sum, book) => sum + book.available,
    0
  );

  // Generate the next book ID
  function nextId() {
    const max = books.reduce(
      (currentMax, book) =>
        Math.max(
          currentMax,
          Number(book.id.slice(1)) || 0
        ),
      0
    );

    return `B${String(max + 1).padStart(3, "0")}`;
  }

  // Add a new book
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const copies = Number(form.copies);

    if (!form.title.trim() || !form.author.trim()) {
      setError("Title and author are required.");
      return;
    }

    if (!Number.isInteger(copies) || copies < 1) {
      setError("Copies must be a whole number of at least 1.");
      return;
    }

    const newBook: Book = {
      id: nextId(),
      title: form.title.trim(),
      author: form.author.trim(),
      category: form.category,
      copies,
      available: copies,
    };

    setBooks((current) => [newBook, ...current]);
    setPage(1);
    setForm(emptyForm);
    setError("");
    setShowForm(false);
  }

  // Table columns
  const columns = [
    {
      key: "id",
      header: "Book ID",
      render: (book: Book) => (
        <span className="font-medium text-gray-500">
          {book.id}
        </span>
      ),
    },
    {
      key: "title",
      header: "Book",
      render: (book: Book) => (
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
            <BookOpen size={18} />
          </span>

          <div>
            <p className="font-semibold text-gray-900">
              {book.title}
            </p>
            <p className="mt-0.5 text-xs text-gray-500">
              {book.author}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (book: Book) => book.category,
    },
    {
      key: "copies",
      header: "Total Copies",
      render: (book: Book) => book.copies,
    },
    {
      key: "available",
      header: "Available",
      render: (book: Book) => (
        <span
          className={
            book.available > 0
              ? "font-semibold text-green-700"
              : "font-semibold text-red-600"
          }
        >
          {book.available}
        </span>
      ),
    },
    {
      key: "status",
      header: "Availability",
      render: (book: Book) => (
        <StatusBadge
          status={
            book.available > 0 ? "Available" : "Not available"
          }
          className={
            book.available > 0
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">
      {/* Page header */}
      <PageHeader
        title="Library Books"
        description="Maintain the library catalogue and track available copies."
        actions={
          <button
            type="button"
            onClick={() => {
              setForm(emptyForm);
              setError("");
              setShowForm(true);
            }}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white hover:bg-[#1f2a73]"
          >
            <Plus size={17} />
            Add Book
          </button>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Book Titles"
          value={books.length}
          icon={<LibraryBig size={21} />}
          iconClassName="text-indigo-700"
          iconBackgroundClassName="bg-indigo-50"
        />

        <SummaryCard
          label="Total Copies"
          value={totalCopies}
          icon={<BookOpen size={21} />}
          iconClassName="text-blue-700"
          iconBackgroundClassName="bg-blue-50"
        />

        <SummaryCard
          label="Available Copies"
          value={availableCopies}
          icon={<BookOpen size={21} />}
          iconClassName="text-green-700"
          iconBackgroundClassName="bg-green-50"
        />
      </div>

      {/* Books table */}
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Search and filters */}
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 lg:flex-row lg:items-center">
          <div className="min-w-0 flex-1">
            <SearchBar
              value={search}
              onChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              placeholder="Search by book title, author, or ID..."
            />
          </div>

          <div className="w-full sm:w-48">
            <FilterSelect
              value={categoryFilter}
              onChange={(value) => {
                setCategoryFilter(value);
                setPage(1);
              }}
              options={categories}
              placeholder="All categories"
            />
          </div>

          <div className="w-full sm:w-44">
            <FilterSelect
              value={availabilityFilter}
              onChange={(value) => {
                setAvailabilityFilter(value);
                setPage(1);
              }}
              options={["Available", "Not available"]}
              placeholder="All availability"
            />
          </div>
        </div>

        {/* Data table */}
        <DataTable<Book>
          data={pagedBooks}
          columns={columns}
          rowKey={(book) => book.id}
          tableClassName="min-w-[850px] text-sm text-gray-800"
          emptyState="No books match your search or filters."
        />

        {/* Shared pagination component */}
        <div className="border-t border-gray-200 px-5 py-3">
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={filteredBooks.length}
            pageSize={pageSize}
            onPageChange={(nextPage) => setPage(nextPage)}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
            pageSizes={PAGE_SIZES}
            itemLabel="books"
          />
        </div>
      </section>

      {/* Add Book modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="w-full max-w-[480px] rounded-xl bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Add Book
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Enter the book details below.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Close"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 px-5 py-4"
            >
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  value={form.title}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      title: event.target.value,
                    })
                  }
                  placeholder="e.g. Wings of Fire"
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Author
                </label>
                <input
                  value={form.author}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      author: event.target.value,
                    })
                  }
                  placeholder="e.g. A.P.J. Abdul Kalam"
                  className={inputStyle}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        category: event.target.value,
                      })
                    }
                    className={inputStyle}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Copies
                  </label>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={form.copies}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        copies: event.target.value,
                      })
                    }
                    className={inputStyle}
                  />
                </div>
              </div>

              {error && (
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="h-10 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="h-10 rounded-lg bg-[#27348b] px-4 text-sm font-semibold text-white hover:bg-[#1f2a73]"
                >
                  Save Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      
    </div>
  );
}