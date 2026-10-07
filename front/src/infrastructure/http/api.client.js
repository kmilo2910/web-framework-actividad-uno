let backendUserToken = null;

async function getAuthHeaders() {
  const response = await fetch('/auth/access-token', { credentials: 'include' });
  if (!response.ok) return {};
  const { token } = await response.json();
  if (!token) return {};
  const headers = { Authorization: `Bearer ${token}` };
  if (backendUserToken !== token) {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, { headers })
      .then((profileResponse) => {
        if (profileResponse.ok) backendUserToken = token;
      })
      .catch(() => {});
  }
  return headers;
}

export const apiClient = {
  async get(path) {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      headers: authHeaders,
    });
    if (!response.ok) throw new Error((await response.json()).error || 'Error en la API');
    return response.json();
  },
  async post(path, body) {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
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
