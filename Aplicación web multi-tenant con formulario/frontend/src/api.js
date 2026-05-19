const BASE = '/api';

async function request(path, options = {}) {
  const { headers: extraHeaders = {}, ...rest } = options;
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
    ...rest,
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || 'Request failed');
  return body;
}

export function login(email, password, tenantSlug) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, tenantSlug }),
  });
}

export function register(email, password, tenantSlug) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, tenantSlug }),
  });
}

export function logout() {
  return request('/auth/logout', { method: 'POST' });
}

export function submitForm(data) {
  return request('/submissions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getSubmissions() {
  return request('/submissions');
}
