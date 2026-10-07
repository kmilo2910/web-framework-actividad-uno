const apiBaseUrl = '';

async function getAuthHeaders() {
  const response = await fetch('/auth/access-token', { credentials: 'include' });
  if (!response.ok) return {};
  const { token } = await response.json();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export const apiClient = {
  async get(path) {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${apiBaseUrl}${path}`, {
      headers: authHeaders,
    });
    if (!response.ok) throw new Error((await response.json()).error || 'Error en la API');
    return response.json();
  },
  async post(path, body) {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${apiBaseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error((await response.json()).error || 'Error en la API');
    return response.json();
  },
  async patch(path, body = {}) {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${apiBaseUrl}${path}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error((await response.json()).error || 'Error en la API');
    return response.json();
  },
};
