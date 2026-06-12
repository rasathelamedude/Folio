import { LuEye, LuEyeOff } from "react-icons/lu";
import { CiLock } from "react-icons/ci";

interface PasswordFieldProps {
  required?: boolean;
  name: string;
  label: string;
  isPasswordVisible: boolean;
  setIsPasswordVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordField = ({
  required,
  name,
  label,
  isPasswordVisible,
  setIsPasswordVisible,
  handleChange,
}: PasswordFieldProps) => {
  return (
    <>
      <label className="block text-xs font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <CiLock className="text-gray-600 font-bold text-md" />
        </div>
        <input
          required={required}
          onChange={handleChange}
          name={name}
          type={isPasswordVisible ? "text" : "password"}
          placeholder="At least 8 characters"
          className="w-full pl-10 pr-10 py-2.5 bg-[#FBF9F6] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3A7D64] focus:border-transparent transition-all placeholder-gray-400"
        />
        <div
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center cursor-pointer"
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          {isPasswordVisible ? (
            <LuEye className="text-gray-600 font-bold text-md" />
          ) : (
            <LuEyeOff className="text-gray-600 font-bold text-md" />
          )}
        </div>
      </div>
    </>
  );
};

export default PasswordField;
