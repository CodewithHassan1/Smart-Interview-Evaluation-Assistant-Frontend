import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { getCurrentUser, logoutUser } from "./auth";
import Dashboard from "./components/Dashboard";
import AuthPage from "./components/AuthPage";
function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem("evaluation_token"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (authToken) {
      localStorage.setItem("evaluation_token", authToken);
      getCurrentUser(authToken).then((userPayload) => setUser(userPayload)).catch(() => setUser(null));
    }
  }, [authToken]);

  return (
    <BrowserRouter>
      <div className="min-h-screen w-full bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
        <Routes>
          <Route
            path="/"
            element={
              authToken ? (
                <Dashboard authToken={authToken} onLogout={() => logoutUser(setAuthToken, setUser)} user={user} />
              ) : (
                <Navigate to="/signin" replace />
              )
            }
          />
          <Route
            path="/signin"
            element={<AuthPage onSuccess={(token, userPayload) => { setAuthToken(token); setUser(userPayload); }} />}
          />
          <Route
            path="/signup"
            element={<AuthPage signup onSuccess={(token, userPayload) => { setAuthToken(token); setUser(userPayload); }} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
