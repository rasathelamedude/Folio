import { useEffect } from "react";
import { useUserStore } from "../../store/userStore";
import { getProfile } from "../../api/authApi";
import { ImSpinner } from "react-icons/im";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setUser, setIsAuthLoading, isAuthLoading } = useUserStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const data = await getProfile();
        setUser(data.user);
      } catch (error) {
        console.error(error);
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    initializeAuth();
  }, [setIsAuthLoading, setUser]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center">
        <ImSpinner className="animate-spin text-3xl text-[#2A6B56]" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
