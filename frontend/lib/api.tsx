export interface Group {
    id: string;
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

export async function fetchGroups(): Promise<Group[]> {
    const response = await fetch(`${API_URL}/groups`);
    if (!response.ok) {
        throw new Error("Failed to fetch groups");
    }
    const groups = await response.json();
    return groups.map((group: Group) => ({ ...group, id: group.id.toString() }));
}

export async function createGroup(groupData: GroupCreate): Promise<Group> {
    const response = await fetch(`${API_URL}/groups`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(groupData),
    });
    if (!response.ok) {
        throw new Error("Failed to create group");
    }
    const group = await response.json();
    return { ...group, id: group.id.toString() };
}

export async function fetchGroup(id: number): Promise<Group> {
    const response = await fetch(`${API_URL}/groups/${id}`);
    if (!response.ok) {
        throw new Error("Failed to fetch groups");
    }
    const group = await response.json();
    return { ...group, id: group.id.toString() };
}

export async function fetchGroupAnalysis(id: number): Promise<any> {
    const response = await fetch(`${API_URL}/groups/${id}/analysis`);
    if (!response.ok) {
        throw new Error("Failed to fetch group analysis");
    }
    return response.json();
}

export async function updateGroup(
    id: number,
    groupData: Partial<GroupCreate>
): Promise<Group> {
    const response = await fetch(`${API_URL}/groups/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
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

export async function fetchGroupExpenses(id: number): Promise<Expense[]> {
    const response = await fetch(`${API_URL}/groups/${id}/expenses`);
    if (!response.ok) {
        throw new Error("Failed to fetch group expenses");
    }
    return response.json();
}

export async function deleteGroup(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/groups/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Failed to delete group");
    }
}
