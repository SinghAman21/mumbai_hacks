export interface Group {
  id: number;
  name: string;
  type: string;
  totalTransactions: number;
  approvedTransactions: number;
  pendingTransactions: number;
  netAmount: number;
  memberCount: number;
  lastActivity: string;
}

export interface GroupCreate {
  name: string;
  type: string;
}

const API_URL = "http://localhost:8000/api";

// ⛔ DO NOT REDIRECT INSIDE FETCH
// ⛔ DO NOT USE window.location HERE
// This is server-safe and client-safe.

/**
 * Safe JSON parser — avoids frontend crashes
 */
async function safeJson<T>(response: Response): Promise<T> {
  const text = await response.text();

  if (!text) return {} as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    // Backend returned text/HTML — return as text
    return text as unknown as T;
  }
}

/**
 * Safe API client wrapper
 */
async function apiClient<T>(
  url: string,
  options: RequestInit,
): Promise<{ data: T | null; error: string | null; status: number }> {
  try {
    const response = await fetch(url, options);

    const status = response.status;
    const isJson = response.headers.get("content-type")?.includes("application/json");

    if (!response.ok) {
      const errorBody = isJson ? await safeJson<any>(response) : null;

      return {
        data: null,
        error:
          errorBody?.message ||
          errorBody?.error ||
          `Request failed with status ${status}`,
        status,
      };
    }

    const data = isJson ? await safeJson<T>(response) : null;

    return { data, error: null, status };
  } catch (err: any) {
    return {
      data: null,
      error: err?.message || "Network error",
      status: 0,
    };
  }
}

/**
 * Auth header helper
 */
async function authHeaders(token: string | null): Promise<HeadersInit> {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/* ==============================
       PUBLIC API FUNCTIONS
============================== */

export async function fetchGroups(token: string | null) {
  return apiClient<Group[]>(`${API_URL}/groups`, {
    headers: await authHeaders(token),
  });
}

export async function createGroup(groupData: GroupCreate, token: string | null) {
  return apiClient<Group>(`${API_URL}/groups`, {
    method: "POST",
    headers: await authHeaders(token),
    body: JSON.stringify(groupData),
  });
}

export async function fetchGroup(id: number, token: string | null) {
  return apiClient<Group>(`${API_URL}/groups/${id}`, {
    headers: await authHeaders(token),
  });
}

export async function fetchGroupAnalysis(id: number, token: string | null) {
  return apiClient<any>(`${API_URL}/groups/${id}/analysis`, {
    headers: await authHeaders(token),
  });
}
