/**
 * Get staff by business id (hardcoded)
 */
export async function getStaffByBusinessId() {
    const businessId = "9369c165-4672-4ca7-90d7-d3efdafccbd6";
    const endpoint = `/Business/staff/get-staff-by-business-id/${businessId}`;
    return apiGet(endpoint);
}
const BASE_URL = "https://api.booka.kg/api/v1";

export async function apiGet(endpoint: string) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {},
    });
    if (!response.ok) {
        throw new Error(`GET ${endpoint} failed: ${response.status}`);
    }
    return response.json();
}

export async function apiPost(endpoint: string, body: Record<string, unknown>) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    });
    if (!response.ok) {
        throw new Error(`POST ${endpoint} failed: ${response.status}`);
    }
    return response.json();
}

const api = {
    apiGet,
    apiPost
};

export default api;
