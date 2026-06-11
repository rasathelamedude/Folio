import { Route, Routes } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import { lazy, Suspense } from "react";
import AuthLayout from "./layout/AuthLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const HomePage = lazy(() => import("./pages/HomePage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const LibraryPage = lazy(() => import("./pages/LibraryPage"));
const NetworkPage = lazy(() => import("./pages/NetworkPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));

function App() {
  const isAuthenticated: boolean = true;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/network" element={<NetworkPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
