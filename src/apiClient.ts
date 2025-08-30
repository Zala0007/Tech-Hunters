// Lightweight REST client to replace Convex API calls used in components.
const API_BASE = import.meta.env.VITE_API_URL || (window.location.origin + '/api');

async function request(path: string, opts: RequestInit = {}){
  const res = await fetch(API_BASE + path, { ...opts, credentials: 'same-origin', headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) } });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const assets = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params as any).toString();
    return request(`/assets${qs ? '?'+qs : ''}`);
  },
  create: (body: any) => request('/assets', { method: 'POST', body: JSON.stringify(body) }),
  delete: (id: string) => request(`/assets/${id}`, { method: 'DELETE' }),
  stats: () => request('/assets/stats'),
};

export const seed = { run: () => request('/seed', { method: 'POST' }) };

export const renewables = {
  list: (params: any = {}) => request('/renewables/sites' + (Object.keys(params).length ? '?'+new URLSearchParams(params as any).toString() : '')),
  stats: (params: any = {}) => request('/renewables/stats'),
  best: (params: any = {}) => request('/renewables/best' + (params.limit ? '?limit='+params.limit : '')),
};

export const demand = {
  list: (params: any = {}) => request('/demand-clusters' + (Object.keys(params).length ? '?'+new URLSearchParams(params as any).toString() : '')),
  stats: () => request('/demand-clusters/stats'),
};

export const transport = {
  list: (params: any = {}) => request('/transport/infra' + (Object.keys(params).length ? '?'+new URLSearchParams(params as any).toString() : '')),
  stats: (params: any = {}) => request('/transport/stats'),
  corridors: (params: any = {}) => request('/transport/corridors' + (Object.keys(params).length ? '?'+new URLSearchParams(params as any).toString() : '')),
};

export const recommendations = {
  top: (params: any = {}) => request('/recommendations/top' + (params.limit ? '?limit='+params.limit : '')),
  user: (params: any = {}) => request('/recommendations/user'),
  generate: (body:any) => request('/recommendations/generate', { method: 'POST', body: JSON.stringify(body) }),
  compare: (body:any) => request('/recommendations/compare', { method: 'POST', body: JSON.stringify(body) }),
};

export const scenarios = {
  user: (params: any = {}) => request('/scenarios/user' + (params.limit ? '?limit='+params.limit : '')),
  public: (params: any = {}) => request('/scenarios/public' + (params.limit ? '?limit='+params.limit : '')),
  create: (body:any) => request('/scenarios', { method: 'POST', body: JSON.stringify(body) }),
  delete: (id:string) => request('/scenarios/'+id, { method: 'DELETE' }),
  compare: (body:any) => request('/scenarios/compare', { method: 'POST', body: JSON.stringify(body) }),
};

export const policies = {
  state: (params: any = {}) => request('/policies/state' + (params.state ? '?state='+params.state : '')),
  top: (params: any = {}) => request('/policies/top' + (params.limit ? '?limit='+params.limit : '')),
  compare: (body:any) => request('/policies/compare', { method: 'POST', body: JSON.stringify(body) }),
};

export const auth = {
  signin: (body:any) => request('/auth/signin', { method: 'POST', body: JSON.stringify(body) }),
  signup: (body:any) => request('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
  signout: () => request('/auth/signout', { method: 'POST' }),
  me: () => request('/auth/me'),
};

// Simple React hooks (very small) to replace Convex hooks used in components.
import { useEffect, useState } from 'react';

export function useRestQuery(fn: (...args:any[]) => Promise<any>, params?: any){
  const [data, setData] = useState<any>(undefined);
  useEffect(() => { let mounted = true; fn(params || {}).then((d)=> mounted && setData(d)).catch(()=>{}); return ()=>{ mounted = false; } }, [JSON.stringify(params)]);
  return data;
}

export function useRestMutation(fn: (...args:any[])=>Promise<any>){
  return async (body:any) => fn(body);
}

export default { assets, seed, renewables, demand, transport, recommendations, scenarios, policies, auth, useRestQuery, useRestMutation };
