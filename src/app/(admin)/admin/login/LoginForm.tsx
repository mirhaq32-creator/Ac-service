"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Snowflake } from "lucide-react";

import type { AdminConfigStatus } from "@/lib/admin/auth";
import { forgotPasswordAction, loginAction, type ActionState } from "../actions";

/**
 * Admin login (PRD §12.1): email + password via Supabase Auth, with a
 * forgot-password state. One admin only; the allow-list is re-checked
 * server-side in the action. Configuration problems are reported with
 * variable NAMES only — never values.
 */
export function LoginForm({
  status,
  missingForCms,
}: {
  status: AdminConfigStatus;
  missingForCms: string[];
}) {
  const params = useSearchParams();
  const mode = params.get("mode") === "forgot" ? "forgot" : "login";
  const [loginState, loginSubmit, loginPending] = useActionState<
    ActionState | null,
    FormData
  >(loginAction, null);
  const [forgotState, forgotSubmit, forgotPending] = useActionState<
    ActionState | null,
    FormData
  >(forgotPasswordAction, null);

  return (
    <div className="w-full max-w-md rounded-2xl border border-line bg-bg p-8 shadow-s2">
      <div className="flex flex-col items-center">
        <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-ink text-accent-bright">
          <Snowflake className="size-8" strokeWidth={1.75} />
        </span>
        <h1 className="mt-4 font-heading text-2xl font-bold text-ink">Control Panel</h1>
        <p className="mt-1 text-sm text-muted">Supervisor Login</p>
      </div>

      {/* Configuration status: variable names only, never values */}
      {status.loginReady ? (
        <p
          className="mt-6 rounded-xl bg-success/10 px-4 py-3 text-sm leading-relaxed text-success"
          role="status"
        >
          Supabase configuration detected — login is enabled.
          {missingForCms.length > 0 ? (
            <>
              {" "}
              Content management still requires:{" "}
              <code className="font-semibold">{missingForCms.join(", ")}</code>.
            </>
          ) : null}
        </p>
      ) : (
        <div
          className="mt-6 rounded-xl bg-warn/10 px-4 py-3 text-sm leading-relaxed text-warn"
          role="alert"
        >
          <p>
            Required environment variables in{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-xs">.env.local</code> are
            incomplete. Missing:
          </p>
          <ul className="mt-2 list-inside list-disc font-mono text-xs">
            {missingForCms.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
          <p className="mt-2">Fill them in, then restart the development server.</p>
        </div>
      )}

      {mode === "login" ? (
        <form action={loginSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-semibold text-muted">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              dir="ltr"
              autoComplete="username"
              className="mt-1 min-h-12 w-full rounded-xl border border-line bg-bg px-4 text-ink outline-none focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-semibold text-muted">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              dir="ltr"
              autoComplete="current-password"
              className="mt-1 min-h-12 w-full rounded-xl border border-line bg-bg px-4 text-ink outline-none focus:border-accent"
            />
          </div>
          {loginState && !loginState.ok ? (
            <p className="rounded-xl bg-danger/10 px-4 py-2.5 text-sm text-danger" role="alert">
              {loginState.message}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loginPending || !status.loginReady}
            className="min-h-12 w-full cursor-pointer rounded-full bg-accent font-semibold text-white shadow-glow transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loginPending ? "Logging in…" : "Log In"}
          </button>
          <Link
            href="/admin/login?mode=forgot"
            className="block text-center text-sm font-semibold text-accent"
          >
            Forgot your password?
          </Link>
        </form>
      ) : (
        <form action={forgotSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="reset-email" className="text-sm font-semibold text-muted">
              Registered email
            </label>
            <input
              id="reset-email"
              name="email"
              type="email"
              required
              dir="ltr"
              className="mt-1 min-h-12 w-full rounded-xl border border-line bg-bg px-4 text-ink outline-none focus:border-accent"
            />
          </div>
          {forgotState ? (
            <p
              className={`rounded-xl px-4 py-2.5 text-sm ${
                forgotState.ok ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
              }`}
              role="alert"
            >
              {forgotState.message}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={forgotPending || !status.supabaseUrl || !status.anonKey}
            className="min-h-12 w-full cursor-pointer rounded-full bg-ink font-semibold text-white transition hover:bg-ink-2 disabled:opacity-50"
          >
            {forgotPending ? "Sending…" : "Send Reset Link"}
          </button>
          <Link href="/admin/login" className="block text-center text-sm font-semibold text-accent">
            Back to Login
          </Link>
        </form>
      )}
    </div>
  );
}
