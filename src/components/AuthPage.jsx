import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { loginUser, signupUser } from "../auth";

export default function AuthPage({ signup = false, onSuccess }) {
  const { isDark, toggleTheme } = useTheme();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = signup ? { username, email, password } : { username, password };
      const response = signup ? await signupUser(payload) : await loginUser(payload);
      onSuccess(response.token, response.user);
      navigate("/");
    } catch (err) {
      let errorMessage = "Unable to authenticate. Please check your credentials.";
      if (err.response?.data) {
        if (err.response.data.detail) {
          errorMessage = typeof err.response.data.detail === 'string' 
            ? err.response.data.detail 
            : Array.isArray(err.response.data.detail)
            ? err.response.data.detail[0]
            : errorMessage;
        } else if (err.response.data.username) {
          errorMessage = Array.isArray(err.response.data.username) 
            ? err.response.data.username[0] 
            : err.response.data.username;
        } else if (err.response.data.email) {
          errorMessage = Array.isArray(err.response.data.email) 
            ? err.response.data.email[0] 
            : err.response.data.email;
        } else if (err.response.data.password) {
          errorMessage = Array.isArray(err.response.data.password) 
            ? err.response.data.password[0] 
            : err.response.data.password;
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-10 sm:px-6 bg-slate-50 dark:bg-slate-950">
      <div className="absolute top-4 right-4">
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-full bg-slate-200 p-2 text-slate-700 transition hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 1.78a1 1 0 00-1.41 1.41l1.41 1.41a1 1 0 001.41-1.41L14.22 3.78zm2.828 2.828a1 1 0 00-1.414 0l-1.414 1.414a1 1 0 001.414 1.414l1.414-1.414zm2.828 2.829a1 1 0 000 1.414l-1.414 1.414a1 1 0 11-1.414-1.414l1.414-1.414zM16 10a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1zm1.78 4.22a1 1 0 00-1.41-1.41l-1.41 1.41a1 1 0 001.41 1.41l1.41-1.41zm-2.828 2.828a1 1 0 00-1.414 0l-1.414-1.414a1 1 0 011.414-1.414l1.414 1.414zM14 14a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 001 1h4a1 1 0 001-1v-2zm-4-5a3 3 0 110-6 3 3 0 010 6z" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      </div>
      
      <div className="w-full rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200 sm:p-10 dark:bg-slate-900 dark:ring-slate-700">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-500">Smart Interview Evaluation</p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-50">{signup ? "Create your account" : "Sign in to continue"}</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Secure access for hiring managers and technical leads.</p>
        </div>

        <form className="space-y-6" onSubmit={submit}>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Username</label>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="johndoe"
              className="mt-2 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>

          {signup && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder="name@example.com"
                className="mt-2 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              placeholder="••••••••"
              className="mt-2 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>

          {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-brand-700 px-4 py-3 text-white transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:bg-slate-300 dark:hover:bg-brand-600 dark:disabled:bg-slate-600"
          >
            {loading ? "Processing..." : signup ? "Create account" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          {signup ? "Already have an account?" : "New to the evaluation assistant?"}{" "}
          <Link className="font-semibold text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300" to={signup ? "/signin" : "/signup"}>
            {signup ? "Sign in" : "Create one"}
          </Link>
        </p>
      </div>
    </div>
  );
}
