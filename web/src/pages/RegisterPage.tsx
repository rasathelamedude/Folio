import type { UserSignupData } from "~/types/user";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaRegUser, FaRegStar, FaUserFriends } from "react-icons/fa";
import { CiAt, CiMail } from "react-icons/ci";
import { GoSignIn } from "react-icons/go";
import { ImSpinner, ImQuotesLeft } from "react-icons/im";
import { IoBookOutline } from "react-icons/io5";
import InputField from "../components/ui/InputField";
import { signInWithGoogle, signup } from "../api/authApi";
import { useUserStore } from "../store/userStore";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import PasswordField from "../components/ui/PasswordField";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [formData, setFormData] = useState<UserSignupData>({
    email: "",
    password: "",
    name: "",
    username: "",
    profilePicture: "",
  });

  const { setUser } = useUserStore();

  const { isPending, mutate, isError } = useMutation({
    mutationFn: async (data: UserSignupData) => await signup(data),

    onSuccess: (data) => {
      setUser(data.user);
      navigate("/", { replace: true });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGoogleSignup = async () => {
    signInWithGoogle();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="flex flex-col md:flex-row w-full max-w-275 bg-background rounded-2xl shadow-2xl overflow-hidden min-h-175">
        {/* Left Light Panel - Register Form */}
        <div className="w-full md:w-7/12 p-8 md:p-12 lg:px-20 flex flex-col justify-center">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-4xl font-medium text-foreground mb-2">
              Start your{" "}
              <span className="font-serif italic text-primary">reading</span>{" "}
              story
            </h2>
            <p className="text-foreground/75 text-sm">
              Join thousands of readers sharing what they learn.
            </p>
          </div>

          {/* Google Sign Up */}
          <button
            className="w-full flex items-center justify-center gap-3 bg-background border border-secondary rounded-xl py-3 hover:bg-secondary transition-colors mb-5 text-sm font-medium text-foreground shadow-sm cursor-pointer"
            onClick={handleGoogleSignup}
          >
            <FcGoogle size={24} />
            Sign up with Google
          </button>

          {/* Divider */}
          <div className="flex items-center my-5">
            <div className="grow border-t border-secondary"></div>
            <span className="mx-4 text-xs text-foreground/75">
              or fill in your details
            </span>
            <div className="grow border-t border-secondary"></div>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Full Name Input */}
              <div className="flex-1">
                <InputField
                  required
                  type="text"
                  name="name"
                  label="Full name"
                  value={formData.name}
                  icon={
                    <FaRegUser className="text-foreground/75 font-bold text-md" />
                  }
                  className="w-full pl-10 pr-3 py-2.5 bg-secondary text-foreground border border-secondary rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-foreground/60"
                  onChange={(e) => handleChange(e)}
                  placeholder="Rasyar S."
                />
              </div>

              {/* Username Input */}
              <div className="flex-1">
                <InputField
                  required
                  name="username"
                  onChange={handleChange}
                  type="text"
                  placeholder="rasyar"
                  value={formData.username}
                  label="Username"
                  icon={
                    <CiAt className="text-foreground/75 font-bold text-md" />
                  }
                  className="w-full pl-9 pr-3 py-2.5 bg-secondary text-foreground border border-secondary rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-foreground/60"
                />
              </div>
            </div>

            {/* Email Input */}
            <InputField
              required
              name="email"
              onChange={handleChange}
              placeholder="you@example.com"
              value={formData.email}
              label="Email address"
              icon={<CiMail className="text-foreground/75 font-bold text-md" />}
              type="email"
              className="w-full pl-10 pr-4 py-2.5 bg-secondary text-foreground border border-secondary rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-foreground/60"
            />

            {/* Password Input */}
            <PasswordField
              required
              placeholder="At least 7 characters"
              name="password"
              label="Password"
              setIsPasswordVisible={setIsPasswordVisible}
              isPasswordVisible={isPasswordVisible}
              onChange={handleChange}
            />

            {/* Confirm Password Input */}
            <PasswordField
              required
              placeholder="At least 7 characters"
              name="confirmPassword"
              label="Confirm password"
              isPasswordVisible={isConfirmPasswordVisible}
              setIsPasswordVisible={setIsConfirmPasswordVisible}
              onChange={() => {}}
            />

            {isError && (
              <p className="text-sm text-red-500">
                Registration failed. Please check your details and try again.
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full bg-primary hover:bg-foreground text-background font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-4 ${isPending ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
            >
              {isPending ? (
                <>
                  <ImSpinner className="animate-spin text-lg" />
                  <span>Joining Folio...</span>
                </>
              ) : (
                <>
                  <GoSignIn className="text-lg" />
                  <span>Create My Account</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="text-center mt-6">
            <p className="text-[11px] text-foreground/75 mb-3">
              By creating an account you agree to Folio's{" "}
              <Link
                to={"/terms"}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to={"/privacy"}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
            <p className="text-sm text-foreground/75">
              Already a reader?{" "}
              <Link
                to={"/login"}
                className="text-primary font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Right Dark Panel */}
        <div className="hidden md:flex flex-col w-5/12 bg-secondary text-foreground p-12 relative overflow-hidden">
          {/* Logo & Subtitle */}
          <div className="mb-16 z-10">
            <h1 className="text-3xl font-serif tracking-wide">
              <span className="text-primary italic">F</span>olio
            </h1>
            <p className="text-[10px] text-foreground/75 tracking-[0.2em] mt-2 font-medium uppercase">
              Where readers think out loud.
            </p>
          </div>

          {/* Reader's Thought Section */}
          <div className="z-10 mt-4">
            {/* Quote Icon */}
            <ImQuotesLeft className="w-8 h-8 text-accent mb-4 opacity-80" />
            <h2 className="text-3xl font-serif italic leading-snug mb-6 text-foreground">
              Not all readers are leaders, but all leaders are readers.
            </h2>

            <p className="text-foreground/75 text-sm flex items-center mb-16">
              <span className="w-4 h-px bg-accent mr-3"></span>
              Harry S. Truman
            </p>
          </div>

          {/* Features List */}
          <ul className="space-y-4 text-sm text-foreground z-10">
            <li className="flex items-center gap-3">
              <IoBookOutline className="w-5 h-5 text-accent" />
              Build your personal reading library
            </li>
            <li className="flex items-center gap-3">
              <FaRegStar className="w-5 h-5 text-accent" />
              Rate and review every book you finish
            </li>
            <li className="flex items-center gap-3">
              <FaUserFriends className="w-5 h-5 text-accent" />
              Connect with like-minded readers
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
