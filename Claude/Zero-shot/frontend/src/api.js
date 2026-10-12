const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const TOKEN_KEY = "access_token";

let onUnauthorized = () => {};

export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

function extractMessage(data, fallback) {
  if (!data || !data.detail) return fallback;
  if (typeof data.detail === "string") return data.detail;
  if (Array.isArray(data.detail)) {
    return data.detail
      .map((d) => {
        const field = Array.isArray(d.loc) ? d.loc[d.loc.length - 1] : "";
        return field ? `${field}: ${d.msg}` : d.msg;
      })
      .join("; ");
  }
  return fallback;
}

async function request(path, { method = "GET", body, form, auth = true } = {}) {
  const headers = {};
  let payload;

  if (form) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    payload = new URLSearchParams(form).toString();
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { method, headers, body: payload });
  } catch {
    throw new ApiError("Could not reach the server. Please try again.", 0);
  }

  if (response.status === 204) return null;

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    if (response.status === 401 && auth) onUnauthorized();
    throw new ApiError(
      extractMessage(data, `Request failed (${response.status})`),
      response.status
    );
  }

  return data;
}

export const api = {
  register: ({ name, email, password }) =>
    request("/auth/register", {
      method: "POST",
      body: { name, email, password },
      auth: false,
    }),

  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      form: { username: email, password },
      auth: false,
    }),

  me: () => request("/auth/me"),

  listTasks: (status) =>
    request(status ? `/tasks?status=${encodeURIComponent(status)}` : "/tasks"),

  createTask: (data) => request("/tasks", { method: "POST", body: data }),

  updateTask: (id, data) =>
    request(`/tasks/${id}`, { method: "PATCH", body: data }),

  deleteTask: (id) => request(`/tasks/${id}`, { method: "DELETE" }),
};