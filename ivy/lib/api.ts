export interface Group {
    id: number;
    name: string;
    type: string;
    totalTransactions: number;
    approvedTransactions: number;
    pendingTransactions: number;
    netAmount: number;
    memberCount: number;
    lastActivity: string | null;
}

const API_BASE_URL = 'http://localhost:8000/api';

export async function fetchGroups(): Promise<Group[]> {
    const response = await fetch(`${API_BASE_URL}/groups`);
    if (!response.ok) {
        throw new Error('Failed to fetch groups');
    }
    return response.json();
}
