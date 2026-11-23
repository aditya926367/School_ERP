
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "/api";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
};

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body } = options;

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      ...(body !== undefined
        ? { body: JSON.stringify(body) }
        : {}),
    }
  );

//   const data = await response.json().catch(() => null);
const responseText = await response.text();

const data = responseText
  ? JSON.parse(responseText)
  : null;

  if (!response.ok) {
    throw new Error(
      data?.message ||
      data?.error ||
      `API Error: ${response.status}`
    );
  }

  return data as T;
}

const apiClient = {
  get: <T>(endpoint: string) =>
    request<T>(endpoint),

  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, {
      method: "POST",
      body,
    }),

  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, {
      method: "PUT",
      body,
    }),

  patch: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, {
      method: "PATCH",
      body,
    }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, {
      method: "DELETE",
    }),
};

export default apiClient;
