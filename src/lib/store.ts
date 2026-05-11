import type { Tool, ToolFormData, ApiListResponse, Stats } from '../types';

const API = '/api';

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  const jwt = typeof localStorage !== 'undefined' ? localStorage.getItem('toolkit_jwt') : null;
  if (jwt) headers['authorization'] = `Bearer ${jwt}`;
  return headers;
}

async function req<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { ...getHeaders(), ...(options?.headers || {}) },
  });
  if (!res.ok) {
    let msg = 'Error';
    try { const data = await res.json(); msg = data.error || `HTTP ${res.status}`; } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export const store = {
  async list(params: Record<string, string | number | boolean> = {}): Promise<ApiListResponse> {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.set(k, String(v)); });
    return store._listAll(`${API}/tools?${qs}`, params);
  },

  async _listAll(baseUrl: string, params: Record<string, any>): Promise<ApiListResponse> {
    const limit = params.limit || 50;
    const offset = params.offset || 0;
    const url = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}limit=${limit}&offset=${offset}`;
    return req<ApiListResponse>(url);
  },

  async get(id: string): Promise<Tool> {
    return req<Tool>(`${API}/tools/${id}`);
  },

  async create(data: ToolFormData & { id?: string }): Promise<Tool> {
    return req<Tool>(`${API}/tools`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<ToolFormData>): Promise<Tool> {
    return req<Tool>(`${API}/tools/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async remove(id: string): Promise<{ ok: boolean }> {
    return req(`${API}/tools/${id}`, { method: 'DELETE' });
  },

  async toggleFav(id: string): Promise<{ favorite: boolean }> {
    return req(`${API}/fav/${id}`, { method: 'PATCH' });
  },

  async visit(id: string): Promise<void> {
    fetch(`${API}/visit/${id}`, { method: 'PATCH' }).catch(() => {});
  },

  async getStats(): Promise<Stats> {
    return req<Stats>(`${API}/stats`);
  },

  async importFile(file: File): Promise<{ imported: number; message: string }> {
    const form = new FormData();
    form.append('file', file);
    return req(`${API}/import`, { method: 'POST', body: form });
  },

  async detect(url: string): Promise<{ name: string; description: string; favicon: string; category: string; tags: string[]; detected: boolean }> {
    return req(`${API}/detect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
  },
};
