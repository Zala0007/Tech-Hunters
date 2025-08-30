"use client";
import { useState } from "react";
import { toast } from "sonner";
import api from "./apiClient";

export function SignInForm() {
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-6">
      <form
        className="flex flex-col gap-4 sm:gap-5"
          onSubmit={async (e) => {
          e.preventDefault();
          setSubmitting(true);
          const form = e.target as HTMLFormElement;
          const formData = Object.fromEntries(new FormData(form) as any);
          try {
            if (flow === 'signUp') {
              await api.auth.signup(formData);
            } else {
              await api.auth.signin(formData);
            }
            toast.success('Signed in');
            setSubmitting(false);
            window.location.reload();
          } catch (err: any) {
            toast.error(err?.message || 'Sign in failed');
            setSubmitting(false);
          }
        }}
      >
        <input
          className="auth-input-field text-sm sm:text-base"
          type="email"
          name="email"
          placeholder="Email"
          required
        />
        <input
          className="auth-input-field text-sm sm:text-base"
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <button 
          className="auth-button w-full sm:w-auto sm:min-w-[200px] md:w-full" 
          type="submit" 
          disabled={submitting}
        >
          {flow === "signIn" ? "Sign in" : "Sign up"}
        </button>
        <div className="text-center text-sm sm:text-base text-secondary">
          <span>
            {flow === "signIn" ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button
            type="button"
            className="text-primary hover:text-primary-hover hover:underline font-medium cursor-pointer text-sm sm:text-base transition-colors"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          >
            {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
          </button>
        </div>
      </form>
      <div className="flex items-center justify-center my-3">
        <hr className="my-4 grow border-gray-200" />
        <span className="mx-4 text-secondary">or</span>
        <hr className="my-4 grow border-gray-200" />
      </div>
      <button
        className="auth-button w-full sm:w-auto sm:min-w-[200px] md:w-full"
        onClick={async () => {
          try { await api.auth.signin({ anonymous: true }); window.location.reload(); } catch { }
        }}
      >
        Sign in anonymously
      </button>
    </div>
  );
}
