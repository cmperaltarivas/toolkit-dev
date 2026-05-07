const API = '/api';

async function req(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    let msg = 'Error';
    try { const data = await res.json(); msg = data.error || `HTTP ${res.status}`; } catch {}
    throw new Error(msg);
  }
  return res.json();
}

const store = {
  async list(params = {}) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.set(k, v); });
    return store._listAll(`${API}/tools?${qs}`, params);
  },

  async _listAll(baseUrl, params) {
    const limit = params.limit || 50;
    const offset = params.offset || 0;
    const url = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}limit=${limit}&offset=${offset}`;
    const data = await req(url);
    return data;
  },

  async get(id) {
    return req(`${API}/tools/${id}`);
  },

  async create(data) {
    return req(`${API}/tools`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async update(id, data) {
    return req(`${API}/tools/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async remove(id) {
    return req(`${API}/tools/${id}`, { method: 'DELETE' });
  },

  async toggleFav(id) {
    return req(`${API}/fav/${id}`, { method: 'PATCH' });
  },

  async visit(id) {
    fetch(`${API}/visit/${id}`, { method: 'PATCH' }).catch(() => {});
  },

  async getCategories() {
    return req(`${API}/categories`);
  },

  async getStats() {
    return req(`${API}/stats`);
  },

  async importFile(file) {
    const form = new FormData();
    form.append('file', file);
    return req(`${API}/import`, { method: 'POST', body: form });
  }
};
