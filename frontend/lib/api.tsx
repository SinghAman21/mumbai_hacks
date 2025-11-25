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

export async function fetchGroups(): Promise<Group[]> {
    const response = await fetch(`${API_URL}/groups`);
    if (!response.ok) {
        throw new Error("Failed to fetch groups");
    }
    return response.json();
}

export async function createGroup(groupData: GroupCreate): Promise<Group> {
    const response = await fetch(`${API_URL}/groups`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(groupData),
    });
    if (!response.ok) {
        throw new Error("Failed to create group");
    }
    return response.json();
}

export async function fetchGroup(id: number): Promise<Group> {
    const response = await fetch(`${API_URL}/groups/${id}`);
    if (!response.ok) {
        throw new Error("Failed to fetch groups");
    }
    return response.json();
}