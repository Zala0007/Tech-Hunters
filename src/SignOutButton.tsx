"use client";
import api from './apiClient';

export function SignOutButton() {
  return (
    <button
      className="px-4 py-2 rounded bg-white text-secondary border border-gray-200 font-semibold hover:bg-gray-50 hover:text-secondary-hover transition-colors shadow-sm hover:shadow"
  onClick={async () => { try { await api.auth.signout(); window.location.reload(); } catch {} }}
    >
      Sign out
    </button>
  );
}
