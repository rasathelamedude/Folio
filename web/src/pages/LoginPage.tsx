import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login, signInWithGoogle } from "../api/authApi";
import { useUserStore } from "../store/userStore";
import { FcGoogle } from "react-icons/fc";
import { CiMail } from "react-icons/ci";
import { ImQuotesLeft } from "react-icons/im";
import { HiOutlineLightBulb } from "react-icons/hi";
import { BiCommentDetail } from "react-icons/bi";
import { HiOutlineUsers } from "react-icons/hi2";
import InputField from "../components/ui/InputField";
import PasswordField from "../components/ui/PasswordField";
import type { UserLoginData } from "../types/User";
import { useState } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import { ImSpinner } from "react-icons/im";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserLoginData>({
    email: "",
    password: "",
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: UserLoginData) => login(data),
    onSuccess: (data) => {
      setUser(data.user);
      navigate("/");
    },
  });

  const { setUser } = useUserStore();

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(formData);
  };

  const handleGoogleLogin = () => {
    signInWithGoogle();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="flex flex-col md:flex-row w-full max-w-275 bg-white rounded-2xl shadow-2xl overflow-hidden min-h-175">
        <div className="hidden md:flex flex-col w-5/12 bg-[#121212] text-white p-12 relative overflow-hidden">
          {/* Logo & Subtitle */}
          <div className="mb-16 z-10">
            <h1 className="text-3xl font-serif tracking-wide">
              <span className="text-[#3A7D64] italic">F</span>olio
            </h1>
            <p className="text-[10px] text-gray-500 tracking-[0.2em] mt-2 font-medium uppercase">
              Read. Reflect. Discuss.
            </p>
          </div>

          {/* Reader's Thought Section */}
          <div className="z-10 mt-4">
            {/* Quote Icon */}
            <ImQuotesLeft className="w-8 h-8 text-[#3A7D64] mb-4 opacity-80" />
            <h2 className="text-3xl font-serif italic leading-snug mb-6 text-gray-100">
              A reader lives a thousand lives before he dies. The man who never
              reads lives only one.
            </h2>

            <p className="text-gray-400 text-sm flex items-center mb-16">
              <span className="w-4 h-px bg-gray-600 mr-3"></span>
              George R.R. Martin
            </p>
          </div>

          {/* Features List */}
          <ul className="space-y-4 text-sm text-gray-300 z-10">
            <li className="flex items-center gap-3">
              <HiOutlineLightBulb className="w-6 h-6 text-[#3A7D64]" />
              Share insights from every chapter
            </li>
            <li className="flex items-center gap-3">
              <BiCommentDetail className="w-6 h-6 text-[#3A7D64]" />
              Capture quotes that stayed with you
            </li>
            <li className="flex items-center gap-3">
              <HiOutlineUsers className="w-6 h-6 text-[#3A7D64]" />
              Follow readers who think like you
            </li>
          </ul>
        </div>

        {/* Right Light Panel - Login Form */}
        <div className="w-full md:w-7/12 p-8 md:p-16 lg:px-24 flex flex-col justify-center">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-4xl font-medium text-gray-900 mb-2">
              Sign in to{" "}
              <span className="font-serif italic text-[#3A7D64]">Folio</span>
            </h2>
            <p className="text-gray-500 text-sm">
              Continue your reading journey.
            </p>
          </div>

          {/* Google Sign In */}
          <button
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-lg py-3 hover:bg-gray-50 transition-colors mb-6 text-sm font-medium text-gray-700 shadow-sm cursor-pointer"
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="w-6 h-6" />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="grow border-t border-gray-200"></div>
            <span className="mx-4 text-xs text-gray-400">
              or sign in with email
            </span>
            <div className="grow border-t border-gray-200"></div>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={(e) => handleSubmit(e)}>
            {/* Email Input */}
            <InputField
              name="email"
              type="email"
              placeholder="you@example.com"
              label="Email address"
              icon={<CiMail className="w-5 h-5 text-gray-400" />}
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 bg-[#FBF9F6] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3A7D64] focus:border-transparent transition-all placeholder-gray-400"
            />

            {/* Password Input */}
            <PasswordField
              placeholder="••••••••"
              name="password"
              label="Password"
              required
              isPasswordVisible={isPasswordVisible}
              setIsPasswordVisible={setIsPasswordVisible}
              onChange={handleChange}
            />

            {error && (
              <p className="text-red-500 text-sm mt-2">
                {error?.message || "Something went wrong. Please try again."}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full bg-[#2B614D] hover:bg-[#224e3e] text-white font-medium py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 mt-4 ${isPending ? "pointer-events-none cursor-not-allowed opacity-50" : "cursor-pointer"}`}
            >
              {isPending ? (
                <>
                  <ImSpinner />
                  Signing in...
                </>
              ) : (
                <>
                  <FaLongArrowAltRight className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="flex justify-between items-center mt-8 text-sm">
            <a
              href="#"
              className="text-gray-500 hover:text-gray-800 transition-colors"
            >
              Forgot password?
            </a>
            <p className="text-gray-500">
              No account?{" "}
              <Link
                to={"/register"}
                className="text-[#3A7D64] font-semibold hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
