import { Navigate } from "react-router-dom";

import { useAuth } from "../AuthContext.jsx";

function Loading() {
  return <p className="center-text">Loading...</p>;
}

// Only authenticated users can see the content.
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Login/register pages: logged-in users are sent to the task list.
export function PublicOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (user) return <Navigate to="/" replace />;
  return children;
}