const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const normalizePath = (path) => (path.startsWith("/") ? path : `/${path}`);

async function request(path, options = {}) {
  const { token, method = "GET", data, headers = {} } = options;

  const requestHeaders = {
    ...headers,
  };

  if (token) {
    requestHeaders.Authorization = `Token ${token}`;
  }

  if (data !== undefined) {
    requestHeaders["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${normalizePath(path)}`, {
    method,
    headers: requestHeaders,
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const errorMessage =
      payload?.detail ||
      payload?.non_field_errors?.[0] ||
      payload?.message ||
      "Request failed.";
    throw new Error(errorMessage);
  }

  return payload;
}

export const api = {
  get: (path, token) => request(path, { method: "GET", token }),
  post: (path, data, token) => request(path, { method: "POST", data, token }),
  patch: (path, data, token) => request(path, { method: "PATCH", data, token }),
  put: (path, data, token) => request(path, { method: "PUT", data, token }),
  delete: (path, token) => request(path, { method: "DELETE", token }),
};
