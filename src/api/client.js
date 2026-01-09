const BASE_URL = import.meta.env.VITE_API_URL;

export async function callAPI(
  endpoint,
  { method = 'GET', body, token, headers = {}, onError } = {}
) {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (body) {
    config.body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    if (typeof onError === 'function') {
      onError({
        status: res.status,
        message: data?.message || 'Request failed',
        data,
      });
    }
    
    throw {
      status: res.status,
      message: data?.message || 'Request failed',
      data,
    };
  }

  return data;
}
