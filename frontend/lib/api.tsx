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
  owner_id?: number;
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

export async function updateGroup(
  id: number,
  groupData: Partial<GroupCreate>,
  token: string | null
): Promise<Group> {
  const response = await fetch(`${API_URL}/groups/${id}`, {
    method: "PUT",
    headers: await authHeaders(token),
    body: JSON.stringify(groupData),
  });
  if (!response.ok) {
    throw new Error("Failed to update group");
  }
  const group = await response.json();
  return { ...group, id: group.id.toString() };
}

export interface Expense {
  id: number;
  amount: number;
  description: string;
  category: string;
  payer: {
    name: string;
    id: number;
  };
  created_at: string;
}

export interface GroupLog {
  id: number;
  action: string;
  details: string;
  created_at: string;
}

export async function fetchGroupExpenses(id: number, token: string | null): Promise<Expense[]> {
  const response = await fetch(`${API_URL}/groups/${id}/expenses`, {
    headers: await authHeaders(token),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch group expenses");
  }
  return response.json();
}

export async function fetchGroupLogs(id: number, token: string | null): Promise<GroupLog[]> {
  const response = await fetch(`${API_URL}/groups/${id}/logs`, {
    headers: await authHeaders(token),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch group logs");
  }
  return response.json();
}

export async function deleteGroup(id: number, token: string | null): Promise<void> {
  const response = await fetch(`${API_URL}/groups/${id}`, {
    method: "DELETE",
    headers: await authHeaders(token),
  });
  if (!response.ok) {
    throw new Error("Failed to delete group");
  }
}

export async function leaveGroup(id: number, token: string | null): Promise<void> {
  const response = await fetch(`${API_URL}/groups/${id}/leave`, {
    method: "POST",
    headers: await authHeaders(token),
  });
  if (!response.ok) {
    throw new Error("Failed to leave group");
  }
}

export async function generateInviteLink(id: number, token: string | null): Promise<string> {
  const response = await fetch(`${API_URL}/groups/${id}/invite`, {
    method: "POST",
    headers: await authHeaders(token),
  });
  if (!response.ok) {
    const text = await response.text();
    console.error(`Generate invite failed: ${response.status} ${text}`);
    throw new Error(`Failed to generate invite link: ${response.status} ${text}`);
  }
  const data = await response.json();
  return data.invite_url;
}

export async function joinGroup(inviteToken: string, token: string | null): Promise<Group> {
  const response = await fetch(`${API_URL}/groups/join/`, {
    method: "POST",
    headers: await authHeaders(token),
    body: JSON.stringify({ token: inviteToken }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to join group");
  }

  return response.json();
}
