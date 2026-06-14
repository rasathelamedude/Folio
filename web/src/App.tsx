import { Route, Routes } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import { lazy, Suspense } from "react";
import AuthLayout from "./layout/AuthLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import { useUserStore } from "./store/userStore";
import { ImSpinner } from "react-icons/im";

const HomePage = lazy(() => import("./pages/HomePage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const DiscoverPage = lazy(() => import("./pages/DiscoverPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const LibraryPage = lazy(() => import("./pages/LibraryPage"));
const NetworkPage = lazy(() => import("./pages/NetworkPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));

function App() {
  const user = useUserStore((state) => state.user);
  const isAuthenticated = !!user;

  return (
    <Suspense
      fallback={<ImSpinner className="animate-spin text-3xl text-[#2A6B56]" />}
    >
      <Routes>
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />

        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/network" element={<NetworkPage />} />
          <Route path="/settings" element={<SettingsPage />} />
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
